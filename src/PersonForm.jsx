var React = require('react');
var _ = require('lodash');

var PersonForm = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
       this.changeHandler = this.props.onChange || _.identity;
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var username = this.refs.username.getDOMNode().value.trim();
        var name = this.refs.name.getDOMNode().value.trim();
        this.submitHandler(username, name);
        this.refs.username.getDOMNode().focus();
    },

    handleChange: function(e) {
        var username = this.refs.username.getDOMNode().value.trim();
        var name = this.refs.name.getDOMNode().value;
        this.changeHandler(username, name);
    },

    render: function() {
        return (
            <form className="person-form" onSubmit={this.handleSubmit}>
                <input type="username"
                       placeholder="Username..."
                       value={this.props.draft.username}
                       ref="username"
                       onChange={this.handleChange} />
                <input type="name"
                       placeholder="Full name..."
                       value={this.props.draft.name}
                       ref="name"
                       onChange={this.handleChange}/>
                <input type="submit" value="Add New Person" />
            </form>
        );
    }
});

module.exports = PersonForm;
