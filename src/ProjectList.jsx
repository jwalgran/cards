var React = require('react');
var Project = require('./Project.jsx');
var _ = require('lodash');

var ProjectList = React.createClass({
    render: function() {
        var projectNodes = _.map(this.props.data, function(project) {
            return (
                <Project key={project._id} name={project.name} />
            );
        });
        return (
            <div className="project-list">
                {projectNodes}
            </div>
        );
    }
});

module.exports = ProjectList;
