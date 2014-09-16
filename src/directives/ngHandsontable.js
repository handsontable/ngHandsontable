angular.module('ngHandsontable.directives', [])
	.directive(
	'ngHandsontable',
	[
		'settingFactory',
		'autoCompleteFactory',
		function (settingFactory, autoCompleteFactory) {

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
					console.log('directive: ngHandsontable');
					if (!scope.htSettings) {
						scope.htSettings = {};
					}
					angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));

					var container = settingFactory.getHandsontableContainer();



					if(scope.htSettings.columns) {
						for (var i = 0, length = scope.htSettings.columns.length; i < length; i++) {
							if (scope.htSettings.columns[i].type == 'autocomplete') {
								autoCompleteFactory.parseAutoComplete(scope.htSettings.columns[i], scope.htSettings.data);
							}
						}
					}

					element.append(container);
					console.log(scope.htSettings);
					container.handsontable(scope.htSettings);
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
				scope:true,
				controller: function ($scope) {
					this.setColumnOptions = function (options) {
						if (!$scope.column) {
							$scope.column = {}
						}
						angular.extend($scope.column, options);
					}
				},
				link: function (scope, element, attrs, controllerInstance) {
					console.log('directive: datacolumn');
					var column = {
							data: attrs.value,
							title: scope.$eval(attrs.title)
						};

					var width = scope.$eval(attrs.width);
					var type = scope.$eval(attrs.type);

					if (type){
						column.type = type;
					}

					if (width){
						column.width = width;
					}



					switch (column.type) {
						case 'autocomplete':

							break;

						case 'checkbox':
							if (typeof attrs.checkedtemplate !== 'undefined') {
								column.checkedTemplate = scope.$eval(attrs.checkedtemplate); //if undefined then defaults to Boolean true
							}
							if (typeof attrs.uncheckedtemplate !== 'undefined') {
								column.uncheckedTemplate = scope.$eval(attrs.uncheckedtemplate); //if undefined then defaults to Boolean true
							}
							break;
					}

					if (typeof attrs.readonly !== 'undefined') {
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
					console.log('directive: optionlist');
					var options = {
						optionList: attrs.datarows,
						clickrow: attrs.clickrow
					};

					controllerInstance.setColumnOptions(options);
				}
			}
		}
	]
)
;