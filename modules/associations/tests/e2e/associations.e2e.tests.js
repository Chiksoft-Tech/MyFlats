'use strict';

describe('Associations E2E Tests:', function () {
  describe('Test Associations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/associations');
      expect(element.all(by.repeater('association in associations')).count()).toEqual(0);
    });
  });
});
