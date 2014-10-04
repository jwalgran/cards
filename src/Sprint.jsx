var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var dateFormat = require('./models/sprint').dateFormat;

function extractUnavailableDays(val, contributorCount) {
    var unavailableDays = 0;
    if (_.isNumber(val) && val > 0) {
        unavailableDays += val;
    } else if (_.isString(val)) {
        unavailableDays += contributorCount;
    } else if (_.isObject(val)) { // _.isObject detects arrays too
        _.each(val, function(item) {
            unavailableDays += extractUnavailableDays(item,
                contributorCount);
        });
    }
    return unavailableDays;
}

function subtractUnavailableTime(days, contributorCount, unavailable) {
    var unavailableDays = extractUnavailableDays(unavailable,
        contributorCount);
    return unavailableDays < days ? days - unavailableDays : 0;
}

function calculatePoints(days, contributors, unavailableTime, velocity) {
    var devDays = _.reduce(_.map(contributors, function(percentage) {
        return days * percentage;
    }), function(sum, days) {
        return sum + days;
    });
    var contributorCount = _.isObject(contributors)
        ? _.reduce(contributors, function(sum, val) {
            return sum + val; })
        : 0;
    var availableDevDays = subtractUnavailableTime(devDays,
        contributorCount, unavailableTime);
    return Math.ceil(availableDevDays * velocity);
}

function humanDate(dateString) {
    return moment(dateString, dateFormat).format('MMMM Do YYYY');
}

var Sprint = React.createClass({
    render: function() {
        var points = calculatePoints(this.props.days,
            this.props.contributors, this.props.unavailableTime,
            this.props.planningVelocity);
        return (
            <div className="sprint">
                <div className="sprint-dates">
                    <span className="sprint-start-date">
                        {humanDate(this.props.startDate)}
                    </span>
                    <span> to </span>
                    <span className="sprint-end-date">
                        {humanDate(this.props.endDate)}
                    </span>
                </div>
                <div className="sprint-points">{points} points</div>
            </div>
        );
    }
});

module.exports = Sprint;
