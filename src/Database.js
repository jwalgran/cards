var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var Promise = require('lie');
var util = require('util');
var _ = require('lodash');

var models = require('./models');

var Database = function(localName, remoteDb, syncOptions) {
    EventEmitter.call(this);
    var self = this;
    var pouch = new PouchDB(localName);

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

    // Dynamically create an 'add' method for each model.
    _.each(models, function(model, modelName) {
        var addFunctionName = 'add' + modelName.charAt(0).toUpperCase() + modelName.slice(1);
        self[addFunctionName] = _.partial(self._add, model);
    });

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
