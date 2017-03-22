const citygrid = require('./api/citygrid');
const yelp = require('./api/yelp');
const _ = require('underscore');

let apis = [
  // citygrid,
  yelp
];

let unique = array => _.uniq(_.flatten(array), obj => obj.name);

/**
 * @queryWithFilters is an Object with structure:
 * {
 *   query: String, what the user is searching for,
 *   filters: Array, of filter-ids
 * }
 */
const AppService = {
  find: function(queryWithFilters) {
    let fetches = apis.map(func => {
      return func.fetch(queryWithFilters);
    });

    return Promise.all(fetches)
    .then(apiResults => {
      return new Promise((resolve, reject) => {
        resolve(unique(apiResults));
      });
    })
    .catch(error => console.error(error));
  }
};

module.exports = AppService;
