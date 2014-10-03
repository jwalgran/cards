var React = require('react');
var _ = require('lodash');
var CardList = require('./CardList.jsx');
var CardForm = require('./CardForm.jsx');
var DatabaseDestroyer = require('./DatabaseDestroyer.jsx');
var ProjectList = require('./ProjectList.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            cards: [],
            projects: [],
            draft: { project: '', text: '', points: '' }
        };
    },

    componentDidMount: function() {
        this.props.db.allDocs(function(err, data) {
            this.setState(data);
        }.bind(this));

        this.props.db.on('update', function(data) {
            this.setState(data);
        }.bind(this));
    },

    createCard: function(project, text, points) {
        this.updateDraft(text, points);
        this.props.db.addCard({project: project, text: text, points: points}, function(err) {
            if (!err) {
                this.updateDraft();
            }
        }.bind(this));
    },

    updateDraft: function(project, text, points) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        text = text || '';
        points = isNaN(points) ? '' : points;
        this.setState(_.extend(this.state, {
            draft: {
                project: project,
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
                          projects={this.state.projects}
                          onChange={this.updateDraft}
                          onSubmit={this.createCard} />
                <ProjectList data={this.state.projects} />
                <DatabaseDestroyer
                    onSubmit={this.destroyLocalDatabase} />
            </div>
        );
    }
});

module.exports = App;
