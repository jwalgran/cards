var React = require('react');
var _ = require('lodash');

var Link = React.createClass({
    render: function() {
        var handler = function(e) {
            this.props.action(this.props.value);
        }.bind(this);

        return (
            <a href="#" onClick={handler}>{this.props.children}</a>
        );
    }
});

module.exports = Link;
