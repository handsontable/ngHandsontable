
describe('settingFactory', function() {

  beforeEach(module('ngHandsontable.services'));

  it('should have defined property container className', inject(function(settingFactory) {
    expect(settingFactory.containerClassName).toBe('handsontable-container');
  }));

  it('should create new div element and instance Handsontable injected to it', inject(function(settingFactory) {
    var element = [{appendChild: jasmine.createSpy('appendChild')}];
    var hotSettings = {colHeaders: [1, 2], width: 200, columns: [{width: 100}]};
    var hotInstance = {};
    window.HandsontableOrg = Handsontable;
    window.Handsontable = function(element, settings) {
      hotInstance.element = element;
      hotInstance.settings = settings;
    };

    settingFactory.initializeHandsontable(element, hotSettings);

    expect(element[0].appendChild).toHaveBeenCalled();
    expect(element[0].appendChild.calls.argsFor(0)[0].nodeName).toBe('DIV');
    expect(hotInstance.element.nodeName).toBe('DIV');
    expect(hotInstance.settings).toBe(hotSettings);

    window.Handsontable = HandsontableOrg;
  }));

  it('should update Handsontable settings', inject(function(settingFactory) {
    var hotInstance = {updateSettings: jasmine.createSpy('updateSettings')};
    var hotSettings = {colHeaders: [1, 2], width: 200, columns: [{width: 100}]};

    settingFactory.updateHandsontableSettings(null, hotSettings);

    expect(hotInstance.updateSettings).not.toHaveBeenCalled();

    settingFactory.updateHandsontableSettings(hotInstance, hotSettings);

    expect(hotInstance.updateSettings).toHaveBeenCalledWith(hotSettings);
  }));

  it('should render Handsontable', inject(function(settingFactory) {
    var hotInstance = {render: jasmine.createSpy('render')};

    settingFactory.renderHandsontable(null);

    expect(hotInstance.render).not.toHaveBeenCalled();

    settingFactory.renderHandsontable(hotInstance);

    expect(hotInstance.render).toHaveBeenCalled();
  }));

  it('should returns Handsontable settings from scope', inject(function(settingFactory) {
    var availableOptions = ['data', 'colHeaders'];
    var externalOptions = {
      colHeaders: [1],
      manualColumnResize: true,
      settings: {
        data: [{id: 1}, {id: 2}]
      }
    };

    var settings = settingFactory.setHandsontableSettingsFromScope(availableOptions, externalOptions);

    expect(settings.colHeaders).toEqual([1]);
    expect(settings.data).toEqual([{id: 1}, {id: 2}]);
    expect(settings.manualColumnResize).not.toBeDefined();
  }));

  it('should returns valid scope definition for directives', inject(function(settingFactory) {
    var options = ['foo', 'bar', 'fooBar'];

    var scopeDefinition = settingFactory.getScopeDefinition(options);

    expect(scopeDefinition.datarows).toBe('=');
    expect(scopeDefinition.settings).toBe('=');
    expect(scopeDefinition.foo).toBe('=foo');
    expect(scopeDefinition.bar).toBe('=bar');
    expect(scopeDefinition.fooBar).toBe('=foobar');
  }));
});
