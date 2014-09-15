angular.module('ngHandsontable.directives',[])
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
//				template: '<div class="ui-handsontable-container"></div>',
				scope: settingFactory.getScopeDefinition(htOptions),
				link: function (scope, element, attrs){
					var ngGrid = settingFactory.getHandsontableSettings(element);
					angular.extend(ngGrid.settings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));
					console.log(ngGrid.settings);

					ngGrid.settings['data'] = scope.datarows;
					$(element).append(ngGrid.$container);
					ngGrid.$container.handsontable(ngGrid.settings);

				}
			}
		}
	])
;