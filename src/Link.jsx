var React = require('react');
var _ = require('lodash');

var Link = React.createClass({
    render: function() {
        var handler = function(e) {
            e.preventDefault();
            this.props.action(this.props.value);
        }.bind(this);

        return (
            <a href="#" id={this.props.id} className={this.props.className} onClick={handler}>{this.props.children}</a>
        );
    }
});

module.exports = Link;
