
describe('hotTable - Attribute options watch', function() {
  var rootScope, compile;

  beforeEach(module('ngHandsontable'));

  beforeEach(inject(function(_$compile_, _$rootScope_, $q, hotRegisterer) {
    rootScope = _$rootScope_;
    compile = _$compile_;
    _hotRegisterer = hotRegisterer;
  }));

  afterEach(function() {
    angular.element(document.querySelector('hot-table')).remove();
  });

  it('every hook defined in settings should be replaced by hook defined in attribute', function() {
    rootScope.value = function() {};
    rootScope.value2 = function() {};

    spyOn(rootScope, 'value').and.callThrough();
    spyOn(rootScope, 'value2').and.callThrough();

    var scope = angular.element(compile('<hot-table settings="{onAfterChange: value}" on-after-change="value2"></hot-table>')(rootScope)).isolateScope();

    scope.$digest();

    expect(rootScope.value).not.toHaveBeenCalled();
    expect(rootScope.value2).toHaveBeenCalled();
  });

  it('should call `afterChange` hook once after data changed (defined in settings object)', function() {
    rootScope.value = function() {};
    spyOn(rootScope, 'value').and.callThrough();

    var scope = angular.element(compile('<hot-table settings="{onAfterChange: value}"></hot-table>')(rootScope)).isolateScope();

    scope.$digest();

    expect(rootScope.value).toHaveBeenCalled();
    expect(rootScope.value.calls.count()).toBe(1);

    scope.hotInstance.setDataAtCell(0, 0, '');

    expect(rootScope.value.calls.count()).toBe(2);
  });

  it('should call `afterChange` hook once after data changed (defined in attribute)', function() {
    rootScope.value = function() {};
    spyOn(rootScope, 'value').and.callThrough();

    var scope = angular.element(compile('<hot-table on-after-change="value"></hot-table>')(rootScope)).isolateScope();

    scope.$digest();

    expect(rootScope.value).toHaveBeenCalled();
    expect(rootScope.value.calls.count()).toBe(1);

    scope.hotInstance.setDataAtCell(0, 0, '');

    expect(rootScope.value.calls.count()).toBe(2);
  });
});
