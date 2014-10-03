var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var Promise = require('lie');
var util = require('util');
var _ = require('lodash');
var slug = require('slug');

slug.defaults = slug.defaults = {
    replacement: '',      // replace spaces with replacement
    symbols: true,         // replace unicode symbols or not
    remove: null,          // (optional) regex to remove characters
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
};

function idSegment(string) {
    return slug(string).toLowerCase();
}

function idFromSegments(segments) {
    var mapOver = arguments.length === 1 ? segments : arguments;
    return _.map(mapOver, idSegment).join('_');
}

function nowString() {
    return new Date().getTime().toString();
}

var Database = function(localName, remoteDb, syncOptions) {
    EventEmitter.call(this);
    var self = this;
    var pouch = new PouchDB(localName);

    var models = {
        card: {
            idPrefix: 'card',
            generateId: function(_) {
                return idFromSegments(this.idPrefix, nowString());
            },
            validate: function (card) {
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
            }
        },

        project: {
            idPrefix: 'project',
            generateId: function(data) {
                return idFromSegments(this.idPrefix, data.team,
                    data.group, data.name);
            },
            validate: function(project) {
                if (!project) {
                    return { project: 'Falsy project' };
                };
                if (!project.name) {
                    return { name: 'Missing text' };
                };
                if (!project.team) {
                    return { team: 'Missing team' };
                };
                if (!project.group) {
                    return { group: 'Missing group' };
                };
                return undefined; // No validation failure messages
            }
        }
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
            self.allDocs(function(err, data) {
                if (err) {
                    self.emit('error', err);
                } else {
                    self.emit('update', data);
                }
            });
        });
    });

    self._add = function(model, data, cb) {
        // TODO: Generate an ID that includes the project name
        // so that the allDocs index can be used for filtering
        // by project..
        var id = model.generateId(data);
        var failures = model.validate(data);
        if (failures) {
            cb(failures);
            return;
        }
        pouch.put(data, id, function(err) {
            if (err) {
                self.emit('error', err);
            }
            cb(err);
        });
    };

    self.addCard = _.partial(self._add, models.card);
    self.addProject = _.partial(self._add, models.project);

    self.destroy = function() {
        pouch.destroy();
    };

    self.allDocs = function(cb) {
        var cp = pouch.allDocs({
            descending: true,
            include_docs: true,
            startkey: models.card.idPrefix + '_\uffff',
            endkey: models.card.idPrefix + '_'
        });
        var pp = pouch.allDocs({
            include_docs: true,
            startkey: models.project.idPrefix + '_',
            endkey: models.project.idPrefix + '_\uffff'
        });
        Promise.all([cp, pp]).then(function(results) {
            cb(null, {
                cards: _.map(results[0].rows, function(row) {
                    return row.doc;
                }),
                projects: _.map(results[1].rows, function(row) {
                    return row.doc;
                })
            });            
        });
    };

    return self;
};

util.inherits(Database, EventEmitter);

module.exports = Database;
