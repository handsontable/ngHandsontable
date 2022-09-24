
describe('hotAutocomplete', function() {
  var rootScope, compile;

  beforeEach(module('ngHandsontable'));

  beforeEach(inject(function(_$compile_, _$rootScope_, $q) {
    rootScope = _$rootScope_;
    compile = _$compile_;
  }));

  afterEach(function() {
    angular.element(document.querySelector('hot-table')).remove();
  });

  it('should create Handsontable with autocomplete column cells (as array items)', function() {
    rootScope.list = ['A', 'B', 'C'].join(',');
    var scope = angular.element(compile(
        '<hot-table>' +
          '<hot-column>' +
            '<hot-autocomplete datarows="{{ list }}"></hot-autocomplete>' +
          '</hot-column>' +
        '</hot-table>'
      )(rootScope)).isolateScope();

    scope.$digest();

    expect(scope.hotInstance.getSettings().columns[0].optionList.object).toEqual(['A', 'B', 'C']);
  });

  it('should create Handsontable with autocomplete column cells (with properties)', function() {
    rootScope.list = [{desc: 'Foo'}, {desc: 'Bar'}, {desc: 'Baz'}];
    var scope = angular.element(compile(
        '<hot-table>' +
          '<hot-column>' +
            '<hot-autocomplete datarows="desc in lists"></hot-autocomplete>' +
          '</hot-column>' +
        '</hot-table>'
      )(rootScope)).isolateScope();

    scope.$digest();

    expect(scope.hotInstance.getSettings().columns[0].optionList).toEqual({property: 'desc', object: 'lists'});
  });
});
