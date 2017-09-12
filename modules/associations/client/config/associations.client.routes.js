(function () {
  'use strict';

  angular
    .module('associations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('associations', {
        abstract: true,
        url: '/associations',
        template: '<ui-view/>'
      })
      .state('associations.list', {
        url: '',
        templateUrl: 'modules/associations/client/views/list-associations.client.view.html',
        controller: 'AssociationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Associations List'
        }
      })
      .state('associations.create', {
        url: '/create',
        templateUrl: 'modules/associations/client/views/form-association.client.view.html',
        controller: 'AssociationsController',
        controllerAs: 'vm',
        resolve: {
          associationResolve: newAssociation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Associations Create'
        }
      })
      .state('associations.edit', {
        url: '/:associationId/edit',
        templateUrl: 'modules/associations/client/views/form-association.client.view.html',
        controller: 'AssociationsController',
        controllerAs: 'vm',
        resolve: {
          associationResolve: getAssociation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Association {{ associationResolve.name }}'
        }
      })
      .state('associations.view', {
        url: '/:associationId',
        templateUrl: 'modules/associations/client/views/view-association.client.view.html',
        controller: 'AssociationsController',
        controllerAs: 'vm',
        resolve: {
          associationResolve: getAssociation
        },
        data: {
          pageTitle: 'Association {{ associationResolve.name }}'
        }
      });
  }

  getAssociation.$inject = ['$stateParams', 'AssociationsService'];

  function getAssociation($stateParams, AssociationsService) {
    return AssociationsService.get({
      associationId: $stateParams.associationId
    }).$promise;
  }

  newAssociation.$inject = ['AssociationsService'];

  function newAssociation(AssociationsService) {
    return new AssociationsService();
  }
}());
