
describe('hotColumn', function() {
  var rootScope, compile;

  beforeEach(module('ngHandsontable'));

  beforeEach(inject(function(_$compile_, _$rootScope_, $q) {
    rootScope = _$rootScope_;
    compile = _$compile_;
  }));

  afterEach(function() {
    angular.element(document.querySelector('hot-table')).remove();
  });

  it('should create Handsontable with 3 columns', function() {
    var scope = angular.element(compile(
        '<hot-table>' +
          '<hot-column></hot-column>' +
          '<hot-column></hot-column>' +
          '<hot-column></hot-column>' +
        '</hot-table>'
      )(rootScope)).isolateScope();

    scope.$digest();

    expect(scope.hotInstance.getSettings().columns.length).toBe(3);
  });
});
