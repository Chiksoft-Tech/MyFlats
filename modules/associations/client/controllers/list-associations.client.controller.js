(function () {
  'use strict';

  angular
    .module('associations')
    .controller('AssociationsListController', AssociationsListController);

  AssociationsListController.$inject = ['AssociationsService'];

  function AssociationsListController(AssociationsService) {
    var vm = this;

    vm.associations = AssociationsService.query();
  }
}());
