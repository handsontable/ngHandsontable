angular.module('ngHandsontable.services', [])
	.factory(
	'settingFactory',
	[
		function () {

			return {

				getHandsontableContainer: function () {
					return $('<div class="ng-handsontable-container"></div>');
				},

				setHandsontableSettingsFromScope: function (htOptions, scopeOptions) {
					var i,
						settings = {},
						allOptions = angular.extend({}, scopeOptions);

					angular.extend(allOptions, scopeOptions.settings);

					for (i in htOptions) {
						if (htOptions.hasOwnProperty(i) && typeof allOptions[htOptions[i]] !== 'undefined') {
							settings[htOptions[i]] = allOptions[htOptions[i]];
						}
					}

					if (allOptions.datarows) {
						settings['data'] = allOptions.datarows;
					}

					return settings;
				},

				getScopeDefinition: function (options) {
					var scopeDefinition = {
						selectedIndex: '=selectedindex',
						datarows: '=',
						settings: '='
					};

					for (var i = 0, length = options.length; i < length; i++) {
						scopeDefinition[options[i]] = '=' + options[i].toLowerCase();
					}

					return scopeDefinition;
				}
			}
		}
	]
)
	.factory(
	'autoCompleteFactory',

		function (settingFactory) {
			return {
				parseAutoComplete: function (column, data) {
					console.log(data);
					column.source = ["a", "b", "c"];

				}
			}
		}

);