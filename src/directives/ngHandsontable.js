angular.module('ngHandsontable.directives', [])
	.directive(
	'ngHandsontable',
	[
		'settingFactory',
		function (settingFactory) {

			var publicProperties = Object.keys(Handsontable.DefaultSettings.prototype),
				publicHooks = Object.keys(Handsontable.PluginHooks.hooks),
				htOptions = publicProperties.concat(publicHooks);

			return {
				restrict: 'E',
				scope: settingFactory.getScopeDefinition(htOptions),

				controller: function ($scope) {

					this.getSettings = function () {
						return $scope;
					};

					this.setSettings = function (key, value) {
						$scope.htSettings.settings[key] = value;
					};

					this.setColumns = function (column) {
						$scope.htSettings.settings['columns'].push(column);
						$scope.$apply();
					}
				},
				link: function (scope, element, attrs) {

					scope.htSettings = settingFactory.getHandsontableSettings(element);

					angular.extend(scope.htSettings.settings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));

//					if (ngGrid.settings.columns) {
//						console.log('columns: ', ngGrid.settings.columns);
//					}

//					scope.htSettings =

					$(element).append(scope.htSettings.$container);
					scope.htSettings.$container.handsontable(scope.htSettings.settings);

				}
			}
		}
	])
	.directive(
	'datacolumn',
	[
		'settingFactory',
		function (settingFactory) {
			return {
				restrict: 'E',
				require:'^ngHandsontable',
				link: function (scope, element, attrs, controllerInstance) {

					var x = controllerInstance.getSettings();

					var column = {
							value: attrs.value,
							title: scope.$eval(attrs.title),
							type: scope.$eval(attrs.type),
							width: scope.$eval(attrs.width)
						};



					var keys = [];
					for (var i in attrs){
						if (attrs.hasOwnProperty(i)){
							keys.push(i);
						}
					}

//					controllerInstance.setColumns(column)
				}
			}
		}
	]
)
;