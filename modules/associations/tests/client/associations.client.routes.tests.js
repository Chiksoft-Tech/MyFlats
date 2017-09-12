(function () {
  'use strict';

  describe('Associations Route Tests', function () {
    // Initialize global variables
    var $scope,
      AssociationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AssociationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AssociationsService = _AssociationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('associations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/associations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AssociationsController,
          mockAssociation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('associations.view');
          $templateCache.put('modules/associations/client/views/view-association.client.view.html', '');

          // create mock Association
          mockAssociation = new AssociationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Association Name'
          });

          // Initialize Controller
          AssociationsController = $controller('AssociationsController as vm', {
            $scope: $scope,
            associationResolve: mockAssociation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:associationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.associationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            associationId: 1
          })).toEqual('/associations/1');
        }));

        it('should attach an Association to the controller scope', function () {
          expect($scope.vm.association._id).toBe(mockAssociation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/associations/client/views/view-association.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AssociationsController,
          mockAssociation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('associations.create');
          $templateCache.put('modules/associations/client/views/form-association.client.view.html', '');

          // create mock Association
          mockAssociation = new AssociationsService();

          // Initialize Controller
          AssociationsController = $controller('AssociationsController as vm', {
            $scope: $scope,
            associationResolve: mockAssociation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.associationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/associations/create');
        }));

        it('should attach an Association to the controller scope', function () {
          expect($scope.vm.association._id).toBe(mockAssociation._id);
          expect($scope.vm.association._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/associations/client/views/form-association.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AssociationsController,
          mockAssociation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('associations.edit');
          $templateCache.put('modules/associations/client/views/form-association.client.view.html', '');

          // create mock Association
          mockAssociation = new AssociationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Association Name'
          });

          // Initialize Controller
          AssociationsController = $controller('AssociationsController as vm', {
            $scope: $scope,
            associationResolve: mockAssociation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:associationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.associationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            associationId: 1
          })).toEqual('/associations/1/edit');
        }));

        it('should attach an Association to the controller scope', function () {
          expect($scope.vm.association._id).toBe(mockAssociation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/associations/client/views/form-association.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
