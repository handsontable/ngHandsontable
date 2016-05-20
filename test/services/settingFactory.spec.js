
describe('settingFactory', function() {

  beforeEach(module('ngHandsontable.services'));

  it('should have defined property container className', inject(function(settingFactory) {
    expect(settingFactory.containerClassName).toBe('handsontable-container');
  }));

  it('should create new div element and instance Handsontable injected to it (initializeHandsontable)', inject(function(settingFactory) {
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

  it('should set "id" attribute of wrapper element when "hot-id" attribute is defined', inject(function(settingFactory) {
    var element = [{appendChild: jasmine.createSpy('appendChild')}];
    var hotSettings = {hotId: 'my-table', colHeaders: [1, 2], width: 200, columns: [{width: 100}]};
    var hotInstance = {};

    window.HandsontableOrg = Handsontable;
    window.Handsontable = function(element, settings) {
      hotInstance.element = element;
      hotInstance.settings = settings;
    };

    settingFactory.initializeHandsontable(element, hotSettings);

    expect(element[0].appendChild.calls.argsFor(0)[0].id).toBe('my-table');

    window.Handsontable = HandsontableOrg;
  }));

  it('should update Handsontable settings (updateHandsontableSettings)', inject(function(settingFactory) {
    var hotInstance = {updateSettings: jasmine.createSpy('updateSettings')};
    var hotSettings = {colHeaders: [1, 2], width: 200, columns: [{width: 100}]};

    settingFactory.updateHandsontableSettings(null, hotSettings);

    expect(hotInstance.updateSettings).not.toHaveBeenCalled();

    settingFactory.updateHandsontableSettings(hotInstance, hotSettings);

    expect(hotInstance.updateSettings).toHaveBeenCalledWith(hotSettings);
  }));

  it('should render Handsontable (renderHandsontable)', inject(function(settingFactory) {
    var hotInstance = {render: jasmine.createSpy('render')};

    settingFactory.renderHandsontable(null);

    expect(hotInstance.render).not.toHaveBeenCalled();

    settingFactory.renderHandsontable(hotInstance);

    expect(hotInstance.render).toHaveBeenCalled();
  }));

  it('should merge Handsontable settings from scope (mergeSettingsFromScope)', inject(function(settingFactory) {
    var scopeMock = {
      colHeaders: [1],
      manualColumnResize: true,
      settings: {
        data: [{id: 1}, {id: 2}]
      },
      manualColumnMove: void 0
    };
    var settings = {
      manualColumnMove: true
    };

    settingFactory.mergeSettingsFromScope(settings, scopeMock);

    expect(settings.colHeaders).toEqual([1]);
    expect(settings.data).toEqual([{id: 1}, {id: 2}]);
    expect(settings.manualColumnResize).toBe(true);
    expect(settings.manualColumnMove).toBe(true);
  }));

  it('should merge Handsontable hooks from scope (mergeHooksFromScope)', inject(function(settingFactory) {
    var fnAfterInit = function() {};
    var fnBeforeInit = function() {};
    var fnAfterChange = function() {};
    var scopeMock = {
      afterInit: fnAfterInit,
      settings: {
        onBeforeInit: fnBeforeInit
      },
      onAfterChange: void 0
    };
    var settings = {
      afterChange: fnAfterChange
    };

    settingFactory.mergeHooksFromScope(settings, scopeMock);

    expect(settings.afterInit).toBe(fnAfterInit);
    expect(settings.beforeInit).toBe(fnBeforeInit);
    expect(settings.afterChange).toBe(fnAfterChange);
  }));

  it('should trim scope definition according to attrs object (trimScopeDefinitionAccordingToAttrs)', inject(function(settingFactory) {
    var scopeDefinition = {
      colHeaders: '=',
      manualColumnResize: '=',
      columnSorting: '=',
      afterInit: '&onAfterInit'
    };
    var attrsMock = {
      colHeaders: 'col-headers',
      rowHeaders: 'row-headers',
      onAfterInit: ''
    };

    settingFactory.trimScopeDefinitionAccordingToAttrs(scopeDefinition, attrsMock);

    expect(scopeDefinition.colHeaders).toBe('=');
    expect(scopeDefinition.afterInit).toBe('&onAfterInit');
    expect(scopeDefinition.manualColumnResize).not.toBeDefined();
    expect(scopeDefinition.columnSorting).not.toBeDefined();
  }));

  it('should return scope definition for hot-table directive (getTableScopeDefinition)', inject(function(settingFactory) {
    spyOn(settingFactory, 'applyAvailableSettingsScopeDef');
    spyOn(settingFactory, 'applyAvailableHooksScopeDef');

    var settings = settingFactory.getTableScopeDefinition();

    expect(settingFactory.applyAvailableSettingsScopeDef).toHaveBeenCalled();
    expect(settingFactory.applyAvailableHooksScopeDef).toHaveBeenCalled();
    expect(settings.datarows).toBe('=');
    expect(settings.dataschema).toBe('=');
    expect(settings.observeDomVisibility).toBe('=');
    expect(settings.settings).toBeUndefined();
  }));

  it('should return scope definition for hot-column directive (getColumnScopeDefinition)', inject(function(settingFactory) {
    spyOn(settingFactory, 'applyAvailableSettingsScopeDef');
    spyOn(settingFactory, 'applyAvailableHooksScopeDef');

    var settings = settingFactory.getColumnScopeDefinition();

    expect(settingFactory.applyAvailableSettingsScopeDef).toHaveBeenCalled();
    expect(settingFactory.applyAvailableHooksScopeDef).not.toHaveBeenCalled();
    expect(settings.data).toBe('@');
  }));

  it('should apply all available settings into provided scope definition object (applyAvailableSettingsScopeDef)', inject(function(settingFactory) {
    spyOn(settingFactory, 'getAvailableSettings');
    spyOn(settingFactory, 'getAvailableHooks');

    settingFactory.getAvailableSettings.and.returnValue(['colHeaders', 'rowHeaders']);
    settingFactory.getAvailableHooks.and.returnValue(['afterInit', 'beforeInit']);

    var scopeDef = {};
    var settings = settingFactory.applyAvailableSettingsScopeDef(scopeDef);

    expect(settingFactory.getAvailableSettings).toHaveBeenCalled();
    expect(settingFactory.getAvailableHooks).not.toHaveBeenCalled();
    expect(settings.colHeaders).toBe('=');
    // not exist in available settings collection
    expect(settings.columnSorting).not.toBeDefined();
    // hooks
    expect(settings.afterInit).not.toBeDefined();
    expect(settings.beforeInit).not.toBeDefined();
  }));

  it('should apply all available hooks into provided scope definition object (applyAvailableHooksScopeDef)', inject(function(settingFactory) {
    spyOn(settingFactory, 'getAvailableSettings');
    spyOn(settingFactory, 'getAvailableHooks');

    settingFactory.getAvailableSettings.and.returnValue(['colHeaders', 'rowHeaders']);
    settingFactory.getAvailableHooks.and.returnValue(['afterInit', 'beforeInit']);

    var scopeDef = {};
    var settings = settingFactory.applyAvailableHooksScopeDef(scopeDef);

    expect(settingFactory.getAvailableSettings).not.toHaveBeenCalled();
    expect(settingFactory.getAvailableHooks).toHaveBeenCalled();
    // settings
    expect(settings.colHeaders).not.toBeDefined();
    expect(settings.columnSorting).not.toBeDefined();
    // hooks
    expect(settings.afterInit).toBe('=onAfterInit');
    expect(settings.beforeInit).toBe('=onBeforeInit');
    // not exist in available hooks collection
    expect(settings.afterChange).not.toBeDefined();
  }));

  it('should return all available settings in camelCase mode', inject(function(settingFactory) {
    var settings = settingFactory.getAvailableSettings();

    expect(settings.length).toBeGreaterThan(0);
    expect(settings.indexOf('colHeaders')).toBeGreaterThan(-1);
    expect(settings.indexOf('minSpareRows')).toBeGreaterThan(-1);
    expect(settings.indexOf('data')).toBeGreaterThan(-1);
    expect(settings.indexOf('afterInit')).toBe(-1);
  }));

  it('should return all available settings in hyphenate mode', inject(function(settingFactory) {
    var settings = settingFactory.getAvailableSettings(true);

    expect(settings.length).toBeGreaterThan(0);
    expect(settings.indexOf('col-headers')).toBeGreaterThan(-1);
    expect(settings.indexOf('min-spare-rows')).toBeGreaterThan(-1);
    expect(settings.indexOf('data')).toBeGreaterThan(-1);
    expect(settings.indexOf('afterInit')).toBe(-1);
  }));

  it('should return all hooks in camelCase mode', inject(function(settingFactory) {
    var settings = settingFactory.getAvailableHooks();

    expect(settings.length).toBeGreaterThan(0);
    expect(settings.indexOf('afterInit')).toBeGreaterThan(-1);
    expect(settings.indexOf('beforeInit')).toBeGreaterThan(-1);
    expect(settings.indexOf('construct')).toBeGreaterThan(-1);
    expect(settings.indexOf('colHeaders')).toBe(-1);
  }));

  it('should return all hooks settings in hyphenate mode', inject(function(settingFactory) {
    var settings = settingFactory.getAvailableHooks(true);

    expect(settings.length).toBeGreaterThan(0);
    expect(settings.indexOf('on-after-init')).toBeGreaterThan(-1);
    expect(settings.indexOf('on-before-init')).toBeGreaterThan(-1);
    expect(settings.indexOf('on-construct')).toBeGreaterThan(-1);
    expect(settings.indexOf('on-col-headers')).toBe(-1);
  }));
});
