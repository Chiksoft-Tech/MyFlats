(function () {
  'use strict';

  angular
    .module('associations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Associations',
      state: 'associations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'associations', {
      title: 'List Associations',
      state: 'associations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'associations', {
      title: 'Create Association',
      state: 'associations.create',
      roles: ['user']
    });
  }
}());
