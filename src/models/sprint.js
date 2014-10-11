/*

{
    startDate: YYYY-MM-DD,
    endDate: YYYY-MM-DD,
    planningVelocity: Number,
    days: Number,
    contributors: {
        personId: Number (percentage from 0.0 to 1.0)
    },
    status: String (planning, active, review, complete),
    team: Team ID,
    unavailableTime: {
        vacation: {
            personId: Number (days)
        },
        research: {
            personId: Number (days)
        },
        holiday: String (counts as the sum of contributors values),
        sick: Number (days),
        other: Number (days)
    },
    completedPoints: Number,
    velocity: Number
}

*/

var U = require('../util');
var moment = require('moment');

var dateFormat = 'YYYY-MM-DD';

function dateToSegment(date) {
    return moment(date, dateFormat, true).format('YYYYMMDD');
}

module.exports = {
    idPrefix: 'sprint',
    generateId: function(data) {
        // Neat key trick. Putting the endDate first allows you to run
        // allDocs query with the current YYYYMMDD and find the
        // current sprint.
        return U.idFromSegments(this.idPrefix, data.team,
            dateToSegment(data.endDate),
            dateToSegment(data.startDate));
    },
    validate: function (sprint) {
        if (!sprint) {
            return { sprint: 'Falsy sprint' };
        };
        if (!sprint.startDate) {
            return { startDate: 'Missing startDate' };
        }
        var parsedStartDate = moment(sprint.startDate, dateFormat,
            true);
        if (!parsedStartDate.isValid()) {
            return { startDate: 'startDate is not in the required'
                     + ' format: ' + dateFormat };
        }
        if (!sprint.endDate) {
            return { endDate: 'Missing endDate' };
        }
        var parsedEndDate = moment(sprint.endDate, dateFormat, true);
        if (!parsedEndDate.isValid()) {
            return { endDate: 'endDate is not in the required'
                     + ' format: ' + dateFormat };
        }
        return undefined; // No validation failure messages
    },
    views: {
        'card_status': function(doc) {
            var key = [];
            if (doc._id.substr(0, 5) === 'card_') {
                key.push(doc.sprint ? doc.sprint : null);
                key.push(doc.status ? doc.status : 'open');
                emit(key);
            }
        }
    },
    queries: {
        currentForTeam: {
            optGenerator: function(team) {
                return {
                    startkey: 'sprint_' + team + '_' +
                        moment().format('YYYYMMDD'),
                    endkey: 'sprint_' + team + '_\uffff',
                    limit: 1
                };
            }
        },
        cardsInSprint: {
            view: 'card_status',
            optGenerator: function(sprint) {
                return {
                    startkey: [U.id(sprint)],
                    endkey: [U.id(sprint), {}]
                };
            }
        }
    },
    dateFormat: dateFormat
};
