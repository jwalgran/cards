var React = require('react');
var _ = require('lodash');

var DatabaseDestroyer = React.createClass({
    componentDidMount: function() {
       this.submitHandler = this.props.onSubmit || _.identity;
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.submitHandler();
    },

    render: function() {
        return (
            <form className="database-destroyer-form" onSubmit={this.handleSubmit}>
                <input type="submit" value="Destroy Local Database" />
            </form>
        );
    }
});

module.exports = DatabaseDestroyer;