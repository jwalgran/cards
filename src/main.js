var React = require('react');

var config = require('./config');
var App = require('./App.jsx');
var Database = require('./Database.js');

//TODO: PUT THE 'var' BACK
db = new Database(config.localDb, config.serverDb);
React.renderComponent(App({db: db}), document.getElementById('content'));
