
describe('hotRegisterer', function() {

  beforeEach(module('ngHandsontable.services'));

  it('should be defined', inject(function(hotRegisterer) {
    expect(hotRegisterer).toBeDefined();
  }));

  it('should register Handsontable instance', inject(function(hotRegisterer) {
    var instanceMock = {};
    hotRegisterer.registerInstance('foo', instanceMock);

    expect(hotRegisterer.getInstance('foo')).toBe(instanceMock);
  }));

  it('should overwrite by registered Handsontable instance of the same key', inject(function(hotRegisterer) {
    var instanceMock = {};
    var instanceMock2 = {};
    hotRegisterer.registerInstance('foo', instanceMock);
    hotRegisterer.registerInstance('foo', instanceMock2);

    expect(hotRegisterer.getInstance('foo')).toBe(instanceMock2);
  }));

  it('should remove Handsontable instance', inject(function(hotRegisterer) {
    var instanceMock = {};
    hotRegisterer.registerInstance('foo', instanceMock);
    hotRegisterer.removeInstance('foo');

    expect(hotRegisterer.getInstance('foo')).not.toBeDefined();
  }));
});
