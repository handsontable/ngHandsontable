angular.module('ngHandsontable.services', [])
	.factory(
	'settingFactory',
	[
		function () {

			return {

				initializeHandsontable: function (element, htSettings) {
					var container = $('<div class="ng-handsontable-container"></div>');
					element.append(container);
					container.handsontable(htSettings);
				},

				updateHandsontable: function (element, settings) {
					var container = element.find('.ng-handsontable-container');
					container.handsontable('updateSettings', settings);
				},

				/***
				 *
				 * @param htOptions
				 * @param scopeOptions
				 * @return {{}}
				 */
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

					return settings;
				},

				/***
				 *
				 * @param options
				 * @return {{selectedIndex: string, datarows: string, settings: string}}
				 */
				getScopeDefinition: function (options) {
					var scopeDefinition = {
//						selectedIndex: '=selectedindex',
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

		function () {
			return {
				parseAutoComplete: function (column, dataSet,  propertyOnly) {

					column.source = function (query, process) {
						var hotInstance = $('.ng-handsontable-container').data('handsontable'),
							row = hotInstance.getSelected()[0];

						var data = dataSet[row];
						if (data) {
							var options = column.optionList;

							if(options.object) {
								var objKeys = options.object.split('.')
									,paramObject = data;

								while(objKeys.length > 0) {
									var key = objKeys.shift();
									paramObject = paramObject[key];
								}

								var source = [];
								if (propertyOnly) {
									for(var i = 0, length = paramObject.length; i < length; i++) {
										source.push(paramObject[i][options.property]);
									}
								} else{
									source = paramObject;
								}
								process(source);
							}
						}
					};
				}
			}
		}
);