var React = require('react');
var _ = require('lodash');
var CardList = require('./CardList.jsx');
var CardForm = require('./CardForm.jsx');
var ProjectForm = require('./ProjectForm.jsx');
var DatabaseDestroyer = require('./DatabaseDestroyer.jsx');
var ProjectList = require('./ProjectList.jsx');
var PersonList = require('./PersonList.jsx');
var PersonForm = require('./PersonForm.jsx');
var Sprint = require('./Sprint.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            cards: [],
            projects: [],
            people: [],
            // Hardcoded sprint for testing
            sprint: {
                startDate: '2014-09-26',
                endDate: '2014-10-09',
                planningVelocity: 1.5,
                days: 9.5,
                contributors: {
                    j: 0.8,
                    c: 0.8,
                    ma: 1.0,
                    s: 1.0,
                    l: 1.0,
                    mi: 1.0,
                    r: 1.0,
                    k: 1.0
                },
                status: 'active',
                team: 'civicapps',
                unavailableTime: {
                    research: {
                        j: 1,
                        mi: 1,
                        s: 1
                    },
                    sick: 1.5,
                    holiday: "World Vegitarian Day"
                }
            },
            drafts: {
                card: { project: '', text: '', points: '' },
                project: { name: '', team: '', group: '' },
                person: { username: '', name: '' }
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

    createPerson: function(username, name) {
        this.updateDraftPerson(username, name);
        this.props.db.createPerson({username: username, name: name }, function(err){
            if (!err) {
                this.updateDraftPerson();
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

    updateDraftPerson: function(username, name) {
        // React will only update the DOM value if it is an empty
        // string, not null or undefined;
        username = username || '';
        name = name || '';
        var newDrafts = _.extend(this.state.drafts, {
            person: {
                username: username,
                name: name
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
                <Sprint startDate={this.state.sprint.startDate}
                        endDate={this.state.sprint.endDate}
                        planningVelocity={this.state.sprint.planningVelocity}
                        days={this.state.sprint.days}
                        contributors={this.state.sprint.contributors}
                        unavailableTime={this.state.sprint.unavailableTime}
                />
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
                <PersonList data={this.state.people} />
                <PersonForm draft={this.state.drafts.person}
                             onChange={this.updateDraftPerson}
                             onSubmit={this.createPerson} />
                <DatabaseDestroyer
                    onSubmit={this.destroyLocalDatabase} />
            </div>
        );
    }
});

module.exports = App;
