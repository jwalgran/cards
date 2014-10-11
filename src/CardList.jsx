var React = require('react');
var Card = require('./Card.jsx');
var _ = require('lodash');

var CardList = React.createClass({
    render: function() {
        var projects = this.props.projects;
        var cardNodes = _.map(this.props.data, function(card) {
            var project = _.find(projects, function(project) {
                return project._id === card.project;
            }) || {};
            var cardInSprint = card.sprint === this.props.sprint._id;
            var action = cardInSprint
                ? _.bind(this.props.removeFromSprint, this, card)
                : _.bind(this.props.addToSprint, this, card);
            var label = cardInSprint ? "Remove" : "Add";
            var actionButton = (<button onClick={action}>{label}</button>);
            return (
                <Card key={card._id} actionButton={actionButton} sprint={this.props.sprint} project={project} text={card.text} points={card.points} />
            );
        }.bind(this));
        return (
            <div className="card-list">
                {cardNodes}
            </div>
        );
    }
});

module.exports = CardList;
