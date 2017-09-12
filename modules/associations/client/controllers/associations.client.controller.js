(function () {
  'use strict';

  // Associations controller
  angular
    .module('associations')
    .controller('AssociationsController', AssociationsController);

  AssociationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'associationResolve'];

  function AssociationsController ($scope, $state, $window, Authentication, association) {
    var vm = this;

    vm.authentication = Authentication;
    vm.association = association;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Association
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.association.$remove($state.go('associations.list'));
      }
    }

    // Save Association
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.associationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.association._id) {
        vm.association.$update(successCallback, errorCallback);
      } else {
        vm.association.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('associations.view', {
          associationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
