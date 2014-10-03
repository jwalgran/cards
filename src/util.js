var slug = require('slug');
var _ = require('lodash');

slug.defaults = slug.defaults = {
    replacement: '',      // replace spaces with replacement
    symbols: true,         // replace unicode symbols or not
    remove: null,          // (optional) regex to remove characters
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
};

function idSegment(string) {
    return slug(string).toLowerCase();
};

module.exports = {

    idFromSegments: function(segments) {
        var mapOver = arguments.length === 1 ? segments : arguments;
        return _.map(mapOver, idSegment).join('_');
    },

    nowString: function() {
        return new Date().getTime().toString();
    }
};
