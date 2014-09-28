var React = require('react');

var Card = React.createClass({
    render: function() {
        return (
            <div className="card">
                <div className="card-text">{this.props.text}</div>
                <div className="card-points">{this.props.points}</div>
            </div>
        );
    }
});

module.exports = Card;