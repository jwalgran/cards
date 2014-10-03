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
            return (
                <Card key={card._id} project={project} text={card.text} points={card.points} />
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
