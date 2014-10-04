var React = require('react');
var _ = require('lodash');
var CardList = require('./CardList.jsx');
var CardForm = require('./CardForm.jsx');
var ProjectForm = require('./ProjectForm.jsx');
var DatabaseDestroyer = require('./DatabaseDestroyer.jsx');
var ProjectList = require('./ProjectList.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            cards: [],
            projects: [],
            drafts: {
                card: { project: '', text: '', points: '' },
                project: { name: '', team: '', group: '' }
            }
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
        this.updateDraftCard(project, text, points);
        this.props.db.createCard({project: project, text: text, points: points}, function(err) {
            if (!err) {
                this.updateDraftCard();
            }
        }.bind(this));
    },

    createProject: function(name, team, group) {
        this.updateDraftProject(name, team, group);
        this.props.db.createProject({name: name, team: team, group: group}, function(err){
            if (!err) {
                this.updateDraftProject();
            }
        }.bind(this));
    },

    updateDraftCard: function(project, text, points) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        text = text || '';
        points = isNaN(points) ? '' : points;
        var newDrafts = _.extend(this.state.drafts, {
            card: {
                project: project,
                text: text,
                points: points
            }
        });
        this.setState(_.extend(this.state, { drafts: newDrafts } ));
    },

    updateDraftProject: function(name, team, group) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        name = name || '';
        team = team || '';
        group = group || '';
        var newDrafts = _.extend(this.state.drafts, {
            project: {
                name: name,
                team: team,
                group: group
            }
        });
        this.setState(_.extend(this.state, { drafts: newDrafts } ));
    },

    destroyLocalDatabase: function() {
        this.props.db.destroy();
    },

    render: function() {
        return (
            <div>
                <CardList data={this.state.cards}
                          projects={this.state.projects} />
                <CardForm draft={this.state.drafts.card}
                          projects={this.state.projects}
                          onChange={this.updateDraftCard}
                          onSubmit={this.createCard} />
                <ProjectList data={this.state.projects} />
                <ProjectForm draft={this.state.drafts.project}
                             onChange={this.updateDraftProject}
                             onSubmit={this.createProject} />
                <DatabaseDestroyer
                    onSubmit={this.destroyLocalDatabase} />
            </div>
        );
    }
});

module.exports = App;
