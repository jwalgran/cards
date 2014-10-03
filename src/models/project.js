var U = require('../util');

module.exports = {
    idPrefix: 'project',
    generateId: function(data) {
        return U.idFromSegments(this.idPrefix, data.team,
                                data.group, data.name);
    },
    validate: function(project) {
        if (!project) {
            return { project: 'Falsy project' };
        };
        if (!project.name) {
            return { name: 'Missing text' };
        };
        if (!project.team) {
            return { team: 'Missing team' };
        };
        if (!project.group) {
            return { group: 'Missing group' };
        };
        return undefined; // No validation failure messages
    }
};
