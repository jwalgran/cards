var React = require('react');
var _ = require('lodash');

var CardForm = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
       this.changeHandler = this.props.onChange || _.identity;
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var text = this.refs.text.getDOMNode().value.trim();
        if (!text) {
            return;
        }
        this.submitHandler(text);
    },

    handleTextChange: function(e) {
        var text = this.refs.text.getDOMNode().value || null;
        this.changeHandler(text);
    },

    render: function() {
        return (
            <form className="card-form" onSubmit={this.handleSubmit}>
                <input type="text"
                       placeholder="Describe the task..."
                       value={this.props.draftText}
                       ref="text"
                       onChange={this.handleTextChange} />
                <input type="submit" value="Add To The Backlog" />
            </form>
        );
    }
});

module.exports = CardForm;