/*
 * This can't be DRY'd up by building module.exports dynamically
 * because browserfy needs to be able to resolve all the dependencies
 * via static analysis at bundle build time.
 */
module.exports = {
    card: require('./models/card'),
    project: require('./models/project'),
    person: require('./models/person')
};
