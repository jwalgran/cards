var React = require('react');

var Person = React.createClass({
    render: function() {
        return (
            <div className="Person">
                <div className="person-name">{this.props.name}</div>
            </div>
        );
    }
});

module.exports = Person;
