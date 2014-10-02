var React = require('react');
var _ = require('lodash');
var CardList = require('./CardList.jsx');
var CardForm = require('./CardForm.jsx');
var DatabaseDestroyer = require('./DatabaseDestroyer.jsx');

var App = React.createClass({
    getInitialState: function() {
        return { cards: [], draft: { text: '', points: '' } };
    },

    componentDidMount: function() {
        this.props.db.allCards(function(err, cards) {
            this.setState({ cards: cards });
        }.bind(this));

        this.props.db.on('update', function(cards) {
            this.setState({ cards: cards });
        }.bind(this));
    },

    createCard: function(text, points) {
        this.updateDraft(text, points);
        this.props.db.addCard({text: text, points: points}, function(err) {
            if (!err) {
                this.updateDraft();
            }
        }.bind(this));
    },

    updateDraft: function(text, points) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        text = text || '';
        points = isNaN(points) ? '' : points;
        this.setState(_.extend(this.state, {
            draft: {
                text: text,
                points: points
            }
        }));
    },

    destroyLocalDatabase: function() {
        this.props.db.destroy();
    },

    render: function() {
        return (
            <div>
                <CardList data={this.state.cards} />
                <CardForm draft={this.state.draft}
                          onChange={this.updateDraft}
                          onSubmit={this.createCard} />
                <DatabaseDestroyer
                    onSubmit={this.destroyLocalDatabase} />
            </div>
        );
    }
});

module.exports = App;
