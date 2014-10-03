var React = require('react');
var _ = require('lodash');

var ProjectForm = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
       this.changeHandler = this.props.onChange || _.identity;
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.refs.name.getDOMNode().value.trim();
        var team = this.refs.team.getDOMNode().value.trim();
        var group = this.refs.group.getDOMNode().value.trim();
        if (!name || !team || !group) {
            return;
        }
        this.submitHandler(name, team, group);
        this.refs.name.getDOMNode().focus();
    },

    handleChange: function(e) {
        var name = this.refs.name.getDOMNode().value;
        var team = this.refs.team.getDOMNode().value;
        var group = this.refs.group.getDOMNode().value;
        this.changeHandler(name, team, group);
    },

    render: function() {
        return (
            <form className="project-form" onSubmit={this.handleSubmit}>
                <input type="name"
                       placeholder="Name of the project..."
                       value={this.props.draft.name}
                       ref="name"
                       onChange={this.handleChange} />
                <input type="team"
                       placeholder="Team..."
                       value={this.props.draft.team}
                       ref="team"
                       onChange={this.handleChange}/>
                <input type="group"
                       placeholder="Project group..."
                       value={this.props.draft.group}
                       ref="group"
                       onChange={this.handleChange}/>
                <input type="submit" value="Add New Project" />
            </form>
        );
    }
});

module.exports = ProjectForm;
