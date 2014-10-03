var React = require('react');
var _ = require('lodash');

var CardForm = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
       this.changeHandler = this.props.onChange || _.identity;
    },

    intFromRef: function(ref) {
        return parseInt(this.refs[ref].getDOMNode().value.trim());
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var text = this.refs.text.getDOMNode().value.trim();
        var points = this.intFromRef('points');
        var project = this.refs.project.getDOMNode().value;
        if (!text || isNaN(points) || !project) {
            return;
        }
        this.submitHandler(project, text, points);
        this.refs.text.getDOMNode().focus();
    },

    handleChange: function(e) {
        var text = this.refs.text.getDOMNode().value || null;
        var points = this.refs.points.getDOMNode().value.trim();
        var project = this.refs.project.getDOMNode().value;
        this.changeHandler(project, text, points);
    },

    render: function() {
        var projects = _.map(this.props.projects, function(project) {
            return <option className='card-project' key={project._id} value={project._id}>{project.name}</option>;
        });
        return (
            <form className="card-form" onSubmit={this.handleSubmit}>
                <select className="card-projects" ref="project" onChange={this.handleChange}>{projects}</select>
                <input type="text"
                       placeholder="Describe the task..."
                       value={this.props.draft.text}
                       ref="text"
                       onChange={this.handleChange} />
                <input type="text"
                       placeholder="points..."
                       value={this.props.draft.points}
                       ref="points"
                       onChange={this.handleChange}/>
                <input type="submit" value="Add To The Backlog" />
            </form>
        );
    }
});

module.exports = CardForm;
