'use strict';

/**
 * Module dependencies
 */
var associationsPolicy = require('../policies/associations.server.policy'),
  associations = require('../controllers/associations.server.controller');

module.exports = function(app) {
  // Associations Routes
  app.route('/api/associations').all(associationsPolicy.isAllowed)
    .get(associations.list)
    .post(associations.create);

  app.route('/api/associations/:associationId').all(associationsPolicy.isAllowed)
    .get(associations.read)
    .put(associations.update)
    .delete(associations.delete);

  // Finish by binding the Association middleware
  app.param('associationId', associations.associationByID);
};
