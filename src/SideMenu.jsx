var React = require('react');
var _ = require('lodash');
var Link = require('./Link.jsx');

var SideMenu = React.createClass({
    render: function() {
        var listItems = _.map(this.props.items, function(item) {
            cls = item === this.props.selected
                ? 'pure-menu-selected'
                : '';
            return (
                <li key={item} className={cls}>
                    <Link action={this.props.action} value={item}>{item}</Link>
                </li>
            );
        }.bind(this));
        return (
           <div id="menu">
                <div className="pure-menu pure-menu-open">
                    <ul>
                        {listItems}
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = SideMenu;
