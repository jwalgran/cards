var U = require('../util');

module.exports = {
    idPrefix: 'person',
    generateId: function(data) {
        return U.idFromSegments(this.idPrefix, data.username);
    },
    validate: function (person) {
        if (!person) {
            return { person: 'Falsy person' };
        };
        if (!person.username) {
            return { usernaem: 'Missing username' };
        }
        if (person.username.trim && !person.username.trim()) {
            return { username: 'Empty username' };
        }
        if (!person.name) {
            return { name: 'Missing name' };
        }
        if (person.name.trim && !person.name.trim()) {
            return { username: 'Empty name' };
        }
        return undefined; // No validation failure messages
    }
};
