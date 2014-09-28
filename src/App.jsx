var React = require('react');
var CardList = require('./CardList.jsx');

var App = React.createClass({
    getInitialState: function() {
        return { cards: [] };
    },

    componentDidMount: function() {
        this.props.db.allCards(function(err, cards) {
            this.setState({ cards: cards });
        }.bind(this));

        this.props.db.on('update', function(cards) {
            this.setState({ cards: cards });
        }.bind(this));
    },

    render: function() {
        return (
            <CardList data={this.state.cards} />
        );
    }
});

module.exports = App;
