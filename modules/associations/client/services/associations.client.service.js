// Associations service used to communicate Associations REST endpoints
(function () {
  'use strict';

  angular
    .module('associations')
    .factory('AssociationsService', AssociationsService);

  AssociationsService.$inject = ['$resource'];

  function AssociationsService($resource) {
    return $resource('api/associations/:associationId', {
      associationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
