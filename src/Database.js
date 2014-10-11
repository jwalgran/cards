var PouchDB = require('pouchdb');
var EventEmitter = require('events').EventEmitter;
var Promise = require('lie');
var util = require('util');
var _ = require('lodash');
var pluralize = require('pluralize');

var models = require('./models');

function buildDesignDoc(name, mapFunction) {
    var ddoc = {
        _id: '_design/' + name,
        views: {
        }
    };
    ddoc.views[name] = { map: mapFunction.toString() };
    return ddoc;
}

function overwriteDesignDoc(pouch, newDoc, name) {
    pouch.put(newDoc);
    pouch.get(newDoc._id).then(function (oldDoc) {
        return pouch.remove(oldDoc);
    }).then(function() {
        return pouch.put(newDoc);
    }).then(function() {
        // Query the index to make sure it is up to date.
        // CouchDB/PouchDB indexes update on read, not write.
        return pouch.query(name, {stale: 'update_after'});
    });
};

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

    _.each(models, function(model, modelName) {
        // Dynamically create an 'create' method for each model.
        var createFunctionName = 'create' + modelName.charAt(0).toUpperCase() + modelName.slice(1);
        self[createFunctionName] = _.partial(self._create, model);

        // Add design documents for views
        if (model.views) {
            _.each(model.views, function(viewFn, viewName) {
                var ddoc = buildDesignDoc(viewName, viewFn);
                overwriteDesignDoc(pouch, ddoc, viewName);
            });
        }

        // Append allDocs query functions defined in the models
        if (model.queries) {
            _.each(model.queries, function(queryDef, queryName) {
                self[modelName] = self[modelName] || {};
                self[modelName][queryName] = function() {
                    var args = Array.prototype.slice.call(arguments);
                    var cb = args.pop();
                    var generatedOpts = queryDef.optGenerator.apply(null, args);
                    var opts = _.extend({include_docs: true}, generatedOpts);
                    var resultHandler = function(result) {
                        var docs = _.map(result.rows, 'doc');
                        if (generatedOpts.limit && generatedOpts.limit === 1) {
                            docs = docs.length ? docs[0] : null;
                        }
                        cb(null, docs);
                    };
                    if (queryDef.view) {
                        pouch.query(queryDef.view, opts).then(resultHandler);
                    } else {
                        pouch.allDocs(opts).then(resultHandler);
                    }
                };
            });
        }

        // Append actions defined in the models
        if (model.actions) {
            _.each(model.actions, function(action, actionName) {
                self[modelName] = self[modelName] || {};
                self[modelName][actionName] = _.partial(action, pouch);
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
