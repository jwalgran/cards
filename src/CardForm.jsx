var React = require('react');
var _ = require('lodash');

var CardForm = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
       this.changeHandler = this.props.onChange || _.identity;
    },

    intFromRef: function(ref) {
        return parseInt(this.refs[ref].getDOMNode().value.trim())
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var text = this.refs.text.getDOMNode().value.trim();
        var points = this.intFromRef('points')
        if (!text || isNaN(points)) {
            return;
        }
        this.submitHandler(text, points);
        this.refs.text.getDOMNode().focus();
    },

    handleChange: function(e) {
        var text = this.refs.text.getDOMNode().value || null;
        var points = this.refs.points.getDOMNode().value.trim();
        this.changeHandler(text, points);
    },

    render: function() {
        return (
            <form className="card-form" onSubmit={this.handleSubmit}>
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