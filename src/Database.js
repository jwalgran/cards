var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var Promise = require('lie');
var util = require('util');
var _ = require('lodash');
var pluralize = require('pluralize');

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

    self._create = function(model, data, cb) {
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

    // Dynamically create an 'create' method for each model.
    _.each(models, function(model, modelName) {
        var createFunctionName = 'create' + modelName.charAt(0).toUpperCase() + modelName.slice(1);
        self[createFunctionName] = _.partial(self._create, model);

        if (model.queries) {
            _.each(model.queries, function(queryDef, queryName) {
                self[modelName] = self[modelName] || {};
                self[modelName][queryName] = function() {
                    var args = Array.prototype.slice.call(arguments);
                    var cb = args.pop();
                    var qOpts = queryDef.optGenerator.apply(null, args);
                    pouch.allDocs(
                        _.extend({include_docs: true}, qOpts)
                    ).then(function(result) {
                        var docs = _.map(result.rows, 'doc');
                        if (qOpts.limit && qOpts.limit === 1) {
                            docs = docs.length ? docs[0] : null;
                        }
                        cb(null, docs);
                    });
                };
            });
        }
    });

    self.destroy = function() {
        pouch.destroy();
    };

    self.allDocs = function(cb) {
        var names = _.keys(models);
        var promises = _.map(names, function(name) {
            return pouch.allDocs({
                include_docs: true,
                startkey: models[name].idPrefix + '_',
                endkey: models[name].idPrefix + '_\uffff'
            });
        });
        Promise.all(promises).then(function(results) {
            cb(null, _.reduce(_.zipObject(names, results),
                function(obj, result, name) {
                    obj[pluralize(name)] = _.map(result.rows, 'doc');
                    return obj;
                }, {})
            );
        });
    };

    return self;
};

util.inherits(Database, EventEmitter);

module.exports = Database;
