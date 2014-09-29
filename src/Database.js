var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');

var Database = function(localName, remoteDb, syncOptions) {
    EventEmitter.call(this);
    var self = this;
    var pouch = new PouchDB(localName);
    var cardPrefix = 'card_';

    function allDocsAsArray(opts, cb, eb) {
        var defaults = {
            descending: true,
            include_docs: true
        };
        pouch.allDocs(_.extend(defaults, opts), function(err, results) {
            if (!err) {
                cb(_.map(results.rows, function(row) {
                    return row.doc;
                }));
            } else {
                eb(err);
            }
        });
    };

    function allCardsAsArray(cb, eb) {
        allDocsAsArray({
            // Reverse keys because descending: true
            startkey: cardPrefix + '\uffff',
            endkey: cardPrefix,
            descending: true
        }, cb, eb);
    };

    function validateCard(card) {
        if (!card) {
            return { card: 'Falsy card' };
        };
        if (!card.text) {
            return { text: 'Missing text' };
        }
        if (card.text.trim && !card.text.trim()) {
            return { text: 'Empty text' };
        }
        if (card.points === undefined) {
            return { points: 'Missing points' };
        }
        if (isNaN(card.points)) {
            return { points: 'Points is not a number' };
        }
        return undefined; // No validation failure messages
    };

    if (remoteDb) {
        var opts = syncOptions ||  { live: true };
        pouch.replicate.to(remoteDb, opts);
        pouch.replicate.from(remoteDb, opts);
    }

    pouch.info(function(err, info) {
        pouch.changes({
            since: info.update_seq,
            live: true
        }).on('change', function() {
            allCardsAsArray(
                function(docs) {
                    self.emit('update', docs);
                },
                function(err) {
                    self.emit('error', err);
                }
            );
        });
    });

    self.allCards = function(cb) {
        allCardsAsArray(
            function(docs) {
                cb(null, docs);
            },
            function(err) {
                cb(err, null);
            }
        );
    };

    self.addCard = function(text, points, cb) {
        // TODO: Generate an ID that includes the project name
        // so that the allDocs index can be used for filtering
        // by project..
        var id = cardPrefix + new Date().getTime().toString();
        var card = { text: text, points: points };
        var failures = validateCard(card); 
        if (failures) {
            cb(failures);
            return;
        }
        pouch.put(card, id, function(err) {
            if (err) {
                self.emit('error', err);
            }
            cb(err);
        });
    };

    self.destroy = function() {
        pouch.destroy();
    };

    return self;
};

util.inherits(Database, EventEmitter);

module.exports = Database;
