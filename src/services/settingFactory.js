angular.module('ngHandsontable.services', [])
/***
 *
 */
	.factory(
	'settingFactory',
	[
		function () {

			return {

				containerClassName: 'handsontable-container',

				/***
				 * Append handsontable container div and initialize handsontable instance inside element
				 * @param element
				 * @param htSettings
				 */
				initializeHandsontable: function (element, htSettings) {
					var container = $('<div class="'+ this.containerClassName +'"></div>');
					element.append(container);
					container.handsontable(htSettings);
				},

				/***
				 * Set new settings to handsontable instance
				 * @param element
				 * @param settings
				 */
				updateHandsontableSettings: function (element, settings) {
					var container = $(element).find('.' + this.containerClassName);
					container.handsontable('updateSettings', settings);
				},

				/***
				 * Render handsontable instance inside element
				 * @param element
				 */
				renderHandsontable: function (element) {
					var container = $(element).find('.' + this.containerClassName);
					container.handsontable('render');
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
				 * @return {{datarows: String("="), settings: String("=")}}
				 */
				getScopeDefinition: function (options) {
					var scopeDefinition = {
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
/***
 *
 */
	.factory(
	'autoCompleteFactory',

		function (settingFactory) {
			return {
				parseAutoComplete: function (element, column, dataSet, propertyOnly) {

					column.source = function (query, process) {
						var container = $(element).find('.' + settingFactory.containerClassName),
							hotInstance = container.data('handsontable'),
							row = hotInstance.getSelected()[0];

						var data = dataSet[row];
						if (data) {
							var options = column.optionList;

							console.log(options);

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