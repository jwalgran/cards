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
var SideMenu = require('./SideMenu.jsx');
var SideMenuLink = require('./SideMenuLink.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            cards: [],
            projects: [],
            people: [],
            sprint: {},
            sprints: [],
            drafts: {
                card: { project: '', text: '', points: '' },
                project: { name: '', team: '', group: '' },
                person: { username: '', name: '' }
            },
            page: 'Sprints'
        };
    },

    getCurrentSprintForTeam: function(team) {
        this.props.db.sprint.currentForTeam(team,
            function(err, sprint) {
                if (!err) {
                    this.setState(_.extend(this.state,
                        {sprint: sprint || {}}));
                } else {
                    console.log(err);
                    this.setState(_.extend(this.state, {sprint: {}}));
                }
            }.bind(this));
    },

    componentDidMount: function() {
        this.props.db.allDocs(function(err, data) {
            this.setState(_.extend(this.state, data));
        }.bind(this));

        //TODO: Remove hardcoded team
        this.getCurrentSprintForTeam('civicapps');

        this.props.db.on('update', function(data) {
            this.setState(data);
            this.getCurrentSprintForTeam('civicapps');
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

    addCardToSprint: function(card) {
        if (this.state.sprint) {
            this.props.db.sprint.addCardToSprint(card, this.state.sprint);
        }
    },

    removeCardFromSprint: function(card) {
        this.props.db.sprint.removeCardFromSprint(card);
    },

    selectMenuOption: function(option) {
        this.setState(_.extend(this.state, {page: option}));
    },

    render: function() {
        var pages = ['Sprints', 'Projects', 'People', 'Teams', 'Settings'];
        var activeComponents;
        if (this.state.page === 'Sprints') {
            activeComponents = [
                    <Sprint key="sprint"
                            startDate={this.state.sprint.startDate}
                            endDate={this.state.sprint.endDate}
                            planningVelocity={this.state.sprint.planningVelocity}
                            days={this.state.sprint.days}
                            contributors={this.state.sprint.contributors}
                            unavailableTime={this.state.sprint.unavailableTime}/>,
                    <CardList key="cardlist"
                              data={this.state.cards}
                              projects={this.state.projects}
                              addToSprint={this.addCardToSprint}
                              removeFromSprint={this.removeCardFromSprint}
                              sprint={this.state.sprint} />,
                    <CardForm key="cardform"
                              draft={this.state.drafts.card}
                              projects={this.state.projects}
                              onChange={this.updateDraftCard}
                              onSubmit={this.createCard} />
            ];
        } else if (this.state.page === 'Projects') {
            activeComponents = [
                <ProjectList key="projectlist" data={this.state.projects} />,
                <ProjectForm key="projectform" draft={this.state.drafts.project}
                                     onChange={this.updateDraftProject}
                                     onSubmit={this.createProject} />];
        } else if (this.state.page === 'People') {
            activeComponents = [
                <PersonList key="personlist" data={this.state.people} />,
                <PersonForm key="personform" draft={this.state.drafts.person}
                                     onChange={this.updateDraftPerson}
                                     onSubmit={this.createPerson} />];
        } else if (this.state.page === 'Settings') {
            activeComponents = [<DatabaseDestroyer key="databasedestroyer" onSubmit={this.destroyLocalDatabase} />];
        };

        return (
            <div id="layout" className="layout">
                <SideMenuLink />
                <SideMenu selected={this.state.page}
                          items={pages}
                          action={this.selectMenuOption} />
                <div id="main">
                    <div className="content">
                        {activeComponents}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = App;
