var React = require('react');

var Card = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.text}
            </div>
        );
    }
});

module.exports = Card;