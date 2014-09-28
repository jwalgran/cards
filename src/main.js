var React = require('react');

var config = require('./config');
var App = require('./App.jsx');
var Database = require('./Database.js');

var db = new Database(config.localDb, config.serverDb);
React.renderComponent(App({db: db}), document.getElementById('content'));
