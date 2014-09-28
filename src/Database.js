var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var _ = require('lodash');

var Database = function(localName, remoteDb, syncOptions) {
    EventEmitter.call(this);
    var self = this;
    var pouch = new PouchDB(localName);

    function allDocsAsArray(cb, eb) {
        pouch.allDocs({
            include_docs: true,
            descending: true
        }, function(err, results) {
            if (!err) {
                cb(_.map(results.rows, function(row) {
                    return row.doc;
                }));
            } else {
                eb(err);
            }
        });
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
            allDocsAsArray(
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
        allDocsAsArray(
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
        var id = 'card_' + new Date().getTime().toString();
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
