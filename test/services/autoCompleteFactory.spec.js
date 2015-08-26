
describe('settingFactory', function() {

  beforeEach(module('ngHandsontable.services'));

  it('should have defined property container className', inject(function(autoCompleteFactory) {
    expect(autoCompleteFactory).toBeDefined();
  }));

  it('should create column source function', inject(function(autoCompleteFactory) {
    var column = {};
    var dataSet = [];

    autoCompleteFactory.parseAutoComplete(column, dataSet);

    expect(column.source).toBeDefined();
  }));

  it('should create column source function and shouldn\'t process when data not exists', inject(function(autoCompleteFactory) {
    var instance = {getSelected: function() {}};
    var process = jasmine.createSpy('process');
    var data = [0];
    var column = {optionList: []};
    var dataSet = [];

    column.instance = instance;
    spyOn(instance, 'getSelected').and.returnValue(data);

    autoCompleteFactory.parseAutoComplete(column, dataSet);

    column.source(null, process);

    expect(instance.getSelected).toHaveBeenCalled();
    expect(process).not.toHaveBeenCalled();
  }));

  it('should create column source function and shouldn\'t process when optionList not exists', inject(function(autoCompleteFactory) {
    var instance = {getSelected: function() {}};
    var process = jasmine.createSpy('process');
    var data = [0];
    var columnOptions = {object: false};
    var column = {optionList: columnOptions};
    var dataSet = [{}];

    column.instance = instance;
    spyOn(instance, 'getSelected').and.returnValue(data);

    autoCompleteFactory.parseAutoComplete(column, dataSet);

    column.source(null, process);

    expect(instance.getSelected).toHaveBeenCalled();
    expect(process).not.toHaveBeenCalled();
  }));

  it('should create column source function and should call process callback when column object property is array', inject(function(autoCompleteFactory) {
    var instance = {getSelected: function() {}};
    var process = jasmine.createSpy('process');
    var data = [0];
    var columnOptions = {object: [1, 2, 3, 4, 5]};
    var column = {optionList: columnOptions};
    var dataSet = [{}];

    column.instance = instance;
    spyOn(instance, 'getSelected').and.returnValue(data);

    autoCompleteFactory.parseAutoComplete(column, dataSet);

    column.source(null, process);

    expect(instance.getSelected).toHaveBeenCalled();
    expect(process).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  }));

  it('should create column source function and should call process callback when column object property is string', inject(function(autoCompleteFactory) {
    var instance = {getSelected: function() {}};
    var process = jasmine.createSpy('process');
    var data = [0];
    var columnOptions = {object: 'a.b.c'};
    var column = {optionList: columnOptions};
    var dataSet = [{a: {b: {c: 'test value'}}}];

    column.instance = instance;
    spyOn(instance, 'getSelected').and.returnValue(data);

    autoCompleteFactory.parseAutoComplete(column, dataSet);

    column.source(null, process);

    expect(instance.getSelected).toHaveBeenCalled();
    expect(process).toHaveBeenCalledWith('test value');
  }));

  it('should create column source function and should call process callback when column object property is string and propertyOnly argument is `true`', inject(function(autoCompleteFactory) {
    var instance = {getSelected: function() {}};
    var process = jasmine.createSpy('process');
    var data = [0];
    var columnOptions = {object: 'a.b.c', property: 'myProperty'};
    var column = {optionList: columnOptions};
    var dataSet = [{a: {b: {c: [{myProperty: 1}, {myProperty: 'test'}]}}}];

    column.instance = instance;
    spyOn(instance, 'getSelected').and.returnValue(data);

    autoCompleteFactory.parseAutoComplete(column, dataSet, true);

    column.source(null, process);

    expect(instance.getSelected).toHaveBeenCalled();
    expect(process).toHaveBeenCalledWith([1, 'test']);
  }));
});
