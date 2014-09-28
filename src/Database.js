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

    self.addCard = function(text, cb) {
        // TODO: Generate an ID that includes the project name
        // so that the allDocs index can be used for filtering
        // by project..
        var id = 'card_' + new Date().getTime().toString();
        pouch.put({ text: text }, id, function(err) {
            if (err) {
                self.emit('error', err);
            }
            cb(err);
        });
    };

    return self;
};

util.inherits(Database, EventEmitter);

module.exports = Database;
