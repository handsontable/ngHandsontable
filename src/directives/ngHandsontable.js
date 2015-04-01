angular.module('ngHandsontable.directives', [])
/***
 * Main Angular Handsontable directive
 */
	.directive(
	'hotTable',
	[
		'settingFactory',
		'autoCompleteFactory',
		'$rootScope',
		'$parse',
		function (settingFactory, autoCompleteFactory, $rootScope, $parse) {
			var publicProperties = Object.keys(Handsontable.DefaultSettings.prototype),
				publicHooks = Object.keys(Handsontable.PluginHooks.hooks),
				htOptions = publicProperties.concat(publicHooks);

			return {
				restrict: 'EA',
				scope: settingFactory.getScopeDefinition(htOptions),
				controller:['$scope', function ($scope) {
					this.setColumnSetting = function (column) {
						if (!$scope.htSettings) {
							$scope.htSettings = {};
						}
						if (!$scope.htSettings['columns']) {
							$scope.htSettings.columns = [];
						}
						$scope.htSettings['columns'].push(column);
					};
					this.filter = function(data){
						$scope.htSettings.filterBackup = $scope.htSettings.data;
						$scope.htSettings.data = data;
					};
				}],
				link: function (scope, element, attrs) {
					if (!scope.htSettings) {
						scope.htSettings = {};
					}
					scope.htSettings['data'] = scope.datarows;
					scope.htSettings['filterBackup'] = scope.datarows;
					angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));

					scope.hotInstance = settingFactory.initializeHandsontable(element, scope.htSettings);

					if(scope.htSettings.columns) {
						for (var i = 0, length = scope.htSettings.columns.length; i < length; i++) {

							if (scope.htSettings.columns[i].type == 'autocomplete') {
								if(typeof scope.htSettings.columns[i].optionList === 'string'){
									var optionList = {};
									var match = scope.htSettings.columns[i].optionList.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
									if (match) {
										optionList.property = match[1];
										optionList.object = match[2];
									} else {
										optionList.object = optionList;
									}
									scope.htSettings.columns[i].optionList = optionList;
								}

								autoCompleteFactory.parseAutoComplete(scope.hotInstance, scope.htSettings.columns[i], scope.datarows, true);
							}
						}
						scope.hotInstance.updateSettings(scope.htSettings);
					}

					scope.htSettings.afterChange = function () {
						if (!$rootScope.$$phase){
							scope.$apply();
						}
					};


					var columnSetting = attrs.columns;

					/***
					 * Check if settings has been changed
					 */
					scope.$parent.$watch(
						function () {

							var settingToCheck = scope.$parent;

							if (columnSetting) {
								return angular.toJson($parse(columnSetting)(settingToCheck));
							}

						},
						function () {
							angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope.$parent));
							settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);

						}
					);


					/***
					 * Check if data has been changed
					 */
					scope.$parent.$watch(
						function () {
							var objToCheck = scope.$parent;

							if (!scope.htSettings.filterBackup || scope.htSettings.data.length !== scope.htSettings.filterBackup.length){
								settingFactory.invalidateTable(scope.hotInstance, scope.htSettings);
							}

							return angular.toJson($parse(attrs.datarows)(objToCheck));
						},
						function () {
							settingFactory.renderHandsontable(scope.hotInstance);
						}
					);

					/***
					 * INITIALIZE DATA
					 */
					scope.$watch('datarows', function (newValue, oldValue) {
						if (oldValue.length == scope.htSettings.minSpareRows && newValue.length != scope.htSettings.minSpareRows) {
							scope.htSettings['data'] = scope.datarows;
							settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
						}
					});
				}
			};
		}
	]
)
/***
 * Angular Handsontable directive for single column settings
 */
	.directive(
	'hotColumn',
	[
		function () {
			return {
				restrict: 'E',
				require:'^hotTable',
				scope:{},
				controller:['$scope', function ($scope) {
					this.setColumnOptionList = function (options) {
						if (!$scope.column) {
							$scope.column = {};
						}

						var optionList = {};
						var match = options.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
						if (match) {
							optionList.property = match[1];
							optionList.object = match[2];
						} else {
							optionList.object = options.split(',');
						}
						$scope.column['optionList'] = optionList;
					};

					this.filter = function(data){
						$scope.$filterBackup = $scope.htSettings.data;
						$scope.htSettings.data = data;
					};
				}],
				link: function (scope, element, attributes, controllerInstance) {
					var column = {};

					for (var i in attributes) {
						if (attributes.hasOwnProperty(i)) {
							if (i.charAt(0) !== '$' && typeof column[i] === 'undefined') {
								if (i === 'data') {
									column['data'] = attributes[i];
								}
								else {
									column[i] = scope.$eval(attributes[i]);
								}
							}
						}
					}

					switch (column.type) {
						case 'checkbox':
							if (typeof attributes['checkedtemplate'] !== 'undefined') {
								column.checkedTemplate = scope.$eval(attributes['checkedtemplate']); //if undefined then defaults to Boolean true
							}
							if (typeof attributes['uncheckedtemplate'] !== 'undefined') {
								column.uncheckedTemplate = scope.$eval(attributes['uncheckedtemplate']); //if undefined then defaults to Boolean true
							}
							break;
					}

					if (typeof attributes.readonly !== 'undefined') {
						column.readOnly = true;
					}

					if (!scope.column) {
						scope.column = {};
					}

					angular.extend(scope.column, column);
					controllerInstance.setColumnSetting(scope.column);
				}
			};
		}
	]
)
/***
 * Angular Handsontable directive for autocomplete settings
 */
	.directive(
	'hotAutocomplete',
	[
		function () {
			return {
				restrict: 'E',
				scope: true,
				require:'^hotColumn',
				link: function (scope, element, attrs, controllerInstance) {
					var options = attrs.datarows;
					controllerInstance.setColumnOptionList(options);
				}
			};
		}
	]
)
	.directive(
	'hotFilter',
	[ 'settingFactory',
		'autoCompleteFactory',
		'$rootScope',
		'$parse',
		function (settingFactory, autoCompleteFactory, $rootScope, $parse) {
			var publicProperties = Object.keys(Handsontable.DefaultSettings.prototype),
				publicHooks = Object.keys(Handsontable.PluginHooks.hooks),
				htOptions = publicProperties.concat(publicHooks);

			return {
				restrict : 'A',
				require: '^hotTable',
				link: function (scope, element, attrs, controllerInstance) {

				    var getValuesInSearchQuery = function(dataset, query){
				        var matchingRows = [];
				        var regex = new RegExp(query,"i");
				        for (var i = 0; i < dataset.length; i++){
				            var item = dataset[i];
				            var items = [];
				            items.push(item); 
				            var found = false;
				            var res = "";
				            while (items.length > 0 && found !== true)
				            {
				                var it = items[0];
				                items.shift();
				                for (var property in it) {
				                    if (it.hasOwnProperty(property)) {
				                    var prop = it[property];
				                        if (typeof prop === "object"){
				                           items.push(prop);
				                        }
				                        else if (typeof prop === "function"){
				                            try{
				                                res = prop();
				                                while (typeof res === "function"){
				                                    res = res();
				                                }
				                                if (typeof res === "object"){
				                                    items.push(prop);
				                                }
				                                if (regex.test(prop)){
				                                    found = true;
				                                    break;
				                                }
				                                
				                            }
				                            catch(e){}
				                        }
				                        else{
				                            if (regex.test(prop)){
				                                    found = true;
				                                    break;
				                             }
				                       }
				                    }
				                }
				            }
				            if (found){
				                matchingRows.push(item);
				            }
				        }
				        return matchingRows;
				       
					};

					
					scope.$watch(attrs.hotFilter, function(newValue, oldValue) {
						var val = $parse(attrs.datarows)(scope);
						if (val === undefined){
								return;
						}
						controllerInstance.filter(getValuesInSearchQuery(val,newValue));


					}, true);

					
				}
			};
		}
	]
	);