var React = require('react');
var Person = require('./Person.jsx');
var _ = require('lodash');

var PersonList = React.createClass({
    render: function() {
        var personNodes = _.map(this.props.data, function(person) {
            return (
                <Person key={person._id} name={person.name} />
            );
        });
        return (
            <div className="person-list">
                {personNodes}
            </div>
        );
    }
});

module.exports = PersonList;
