var U = require('../util');

module.exports = {
    idPrefix: 'card',
    generateId: function(_) {
        return U.idFromSegments(this.idPrefix, U.nowString());
    },
    validate: function (card) {
        if (!card) {
            return { card: 'Falsy card' };
        };
        if (!card.text) {
            return { text: 'Missing text' };
        }
        if (card.text.trim && !card.text.trim()) {
            return { text: 'Empty text' };
        }
        if (card.points === undefined) {
            return { points: 'Missing points' };
        }
        if (isNaN(card.points)) {
            return { points: 'Points is not a number' };
        }
        return undefined; // No validation failure messages
    }
};
