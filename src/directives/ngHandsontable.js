angular.module('ngHandsontable.directives', [])
	.directive(
	'ngHandsontable',
	[
		'settingFactory',
		'autoCompleteFactory',
		'$rootScope',
		function (settingFactory, autoCompleteFactory, $rootScope) {

			var publicProperties = Object.keys(Handsontable.DefaultSettings.prototype),
				publicHooks = Object.keys(Handsontable.PluginHooks.hooks),
				htOptions = publicProperties.concat(publicHooks);

			return {
				restrict: 'E',
				scope: settingFactory.getScopeDefinition(htOptions),

				controller: function ($scope) {
					this.setColumnSetting = function (column) {
						if (!$scope.htSettings) {
							$scope.htSettings = {};
						}
						if (!$scope.htSettings['columns']) {
							$scope.htSettings.columns = [];
						}
						$scope.htSettings['columns'].push(column);
					}
				},
				link: function (scope, element, attrs) {
					if (!scope.htSettings) {
						scope.htSettings = {};
					}
					scope.htSettings['data'] = scope.datarows;
					angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));

					if(scope.htSettings.columns) {
						for (var i = 0, length = scope.htSettings.columns.length; i < length; i++) {
							if (scope.htSettings.columns[i].type == 'autocomplete') {
								autoCompleteFactory.parseAutoComplete(scope.htSettings.columns[i], scope.datarows, true);
							}
						}
					}

					scope.htSettings.afterChange = function () {
						if (!$rootScope.$$phase){
							scope.$apply();
						}
					};

					settingFactory.initializeHandsontable(element, scope.htSettings);
				}
			}
		}
	]
)
	.directive(
	'datacolumn',
	[
		function () {
			return {
				restrict: 'E',
				require:'^ngHandsontable',
				scope:{},
				controller: function ($scope) {
					this.setColumnOptionList = function (options) {
						if (!$scope.column) {
							$scope.column = {}
						}

						var optionList = {};

						var match = options.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
						if (match) {
							optionList.property = match[1];
							optionList.object = match[2];
						} else {
							optionList.object = options;
						}
						$scope.column['optionList'] = optionList;
					}
				},
				link: function (scope, element, attributes, controllerInstance) {
					var column = {};

					for (var i in attributes) {
						if (attributes.hasOwnProperty(i)) {
							if (i.charAt(0) !== '$' && typeof column[i] === 'undefined') {
								if (i === 'value') {
									column['data'] = attributes[i];
								} else {
									column[i] = scope.$eval(attributes[i]);
								}
							}
						}
					}

					switch (column.type) {
						case 'checkbox':
							if (typeof attributes.checkedtemplate !== 'undefined') {
								column.checkedTemplate = scope.$eval(attributes.checkedtemplate); //if undefined then defaults to Boolean true
							}
							if (typeof attributes.uncheckedtemplate !== 'undefined') {
								column.uncheckedTemplate = scope.$eval(attributes.uncheckedtemplate); //if undefined then defaults to Boolean true
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
			}
		}
	]
)
	.directive(
	'optionlist',
	[
		function () {
			return {
				restrict: 'E',
				scope: true,
				require:'^datacolumn',
				link: function (scope, element, attrs, controllerInstance) {
					var options = attrs.datarows;
					controllerInstance.setColumnOptionList(options);
				}
			}
		}
	]
)
;