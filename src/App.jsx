var React = require('react');
var _ = require('lodash');
var CardList = require('./CardList.jsx');
var CardForm = require('./CardForm.jsx');
var DatabaseDestroyer = require('./DatabaseDestroyer.jsx');

var App = React.createClass({
    getInitialState: function() {
        return { cards: [], draftText: '' };
    },

    componentDidMount: function() {
        this.props.db.allCards(function(err, cards) {
            this.setState({ cards: cards });
        }.bind(this));

        this.props.db.on('update', function(cards) {
            this.setState({ cards: cards });
        }.bind(this));
    },

    createCard: function(text) {
        this.updateDraftText(text);
        this.props.db.addCard(text, function(err) {
            if (!err) {
                this.updateDraftText();
            }
        }.bind(this));
    },

    updateDraftText: function(text) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        text = text || '';
        this.setState(_.extend(this.state, { draftText: text }));
    },

    destroyLocalDatabase: function() {
        this.props.db.destroy();
    },

    render: function() {
        return (
            <div>
                <CardList data={this.state.cards} />
                <CardForm draftText={this.state.draftText}
                          onChange={this.updateDraftText}
                          onSubmit={this.createCard} />
                <DatabaseDestroyer
                    onSubmit={this.destroyLocalDatabase} />
            </div>
        );
    }
});

module.exports = App;
