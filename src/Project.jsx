var React = require('react');

var Project = React.createClass({
    render: function() {
        return (
            <div className="project">
                <div className="project-name">{this.props.name}</div>
            </div>
        );
    }
});

module.exports = Project;
