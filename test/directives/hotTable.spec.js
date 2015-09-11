
describe('hotTable', function() {
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

  it('should create Handsontable table', function() {
    var scope = angular.element(compile('<hot-table></hot-table>')(rootScope)).isolateScope();

    scope.$digest();

    expect(scope.hotInstance).toBeDefined();
  });

  it('should re-render table after datarows change', function(done) {
    var afterRenderSpy = jasmine.createSpyObj('afterRender', ['callback']);
    rootScope.value = [['foo']];
    var element = angular.element(compile('<hot-table hot-id="hot" datarows="value"></hot-table>')(rootScope));

    angular.element(document.body).append(element);
    rootScope.$digest();

    _hotRegisterer.getInstance('hot').addHook('afterRender', afterRenderSpy.callback);

    setTimeout(function() {
      rootScope.value[0][0] = 'bar';
      rootScope.$digest();

      expect(afterRenderSpy.callback).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should re-render table after columns change', function(done) {
    var afterRenderSpy = jasmine.createSpyObj('callback', ['callback']);
    rootScope.value = [{width: 10, type: 'date'}, {type: 'numeric', format: '$0'}];
    var element = angular.element(compile('<hot-table hot-id="hot" datarows="value"></hot-table>')(rootScope));

    angular.element(document.body).append(element);
    rootScope.$digest();

    _hotRegisterer.getInstance('hot').addHook('afterRender', afterRenderSpy.callback);

    setTimeout(function() {
      rootScope.value.push({type: 'text'});
      rootScope.$digest();

      expect(afterRenderSpy.callback).toHaveBeenCalled();
      done();
    }, 100);
  });
});
