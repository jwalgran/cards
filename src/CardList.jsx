var React = require('react');
var Card = require('./Card.jsx');
var _ = require('lodash');

var CardList = React.createClass({
    render: function() {
        var cardNodes = _.map(this.props.data, function(card) {
            return (
                <Card key={card._id} project={card.project} text={card.text} points={card.points} />
            );
        });
        return (
            <div className="card-list">
                {cardNodes}
            </div>
        );
    }
});

module.exports = CardList;
