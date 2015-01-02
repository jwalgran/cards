var React = require('react');
var _ = require('lodash');
var Link = require('./Link.jsx');

function toggleClass(element, className) {
    var classes = element.className.split(/\s+/),
        length = classes.length,
        i = 0;

    for(; i < length; i++) {
        if (classes[i] === className) {
            classes.splice(i, 1);
            break;
        }
    }
    // The className is not found
    if (length === classes.length) {
        classes.push(className);
    }

    element.className = classes.join(' ');
}

var SideMenuLink = React.createClass({
    toggleMenu: function(e) {
        var layout   = document.getElementById('layout'),
            menu     = document.getElementById('menu'),
            menuLink = document.getElementById('menuLink'),
            active = 'active';

        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    },

    render: function() {
        return (
            <Link action={this.toggleMenu} id="menuLink" className="menu-link"><span /></Link>
        );
    }
});

module.exports = SideMenuLink;
