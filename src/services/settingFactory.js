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
					var container = document.createElement('DIV');
					container.className = this.containerClassName;
					element[0].appendChild(container);

					return new Handsontable(container, htSettings);
				},

				/***
				 * Set new settings to handsontable instance
				 * @param instance
				 * @param settings
				 */
				updateHandsontableSettings: function (instance, settings) {
					if (instance){
						instance.updateSettings(settings);
					}

				},

				/***
				 *	Reset the settings and rerender the handsontable instance inside element
				 * @param instance
				 * @param settings
				 */
				invalidateTable: function(instance, settings){
					if (instance){
						this.updateHandsontableSettings(instance,settings);
						instance.render();
					}
				},

				/***
				 * Render handsontable instance inside element
				 * @param instance
				 */
				renderHandsontable: function (instance) {
					if (instance){
						instance.render();
					}
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
			};
		}
	]
)
/***
 *
 */
	.factory(
	'autoCompleteFactory',
	[
	'$rootScope',
		'$parse',
		function ($rootScope, $parse) {
			return {
				parseAutoComplete: function (instance, column, dataSet, propertyOnly) {
					//don't override existing source functions if they exist already.
					if (typeof column.source === "function"){
						return;
					}
					column.source = function (query, process) {
						var	row = instance.getSelected()[0];
						var source = [];
							var options = column.optionList;
							if (options.object) {
								if (angular.isArray(options.object)) {
									source = options.object;
								}
								else if (typeof options.object === "object"){

									var val = $parse(options.property)(options.object);
									for (var i = 0, length = val.length; i < length; i++) {
										source.push(val[i]);
									}
								} 
								else {
									var objKeys = options.object.split('.')
										, paramObject = data;

									while (objKeys.length > 0) {
										var key = objKeys.shift();
										paramObject = paramObject[key];
									}

									if (propertyOnly) {
										for (var i = 0, length = paramObject.length; i < length; i++) {
											source.push(paramObject[i][options.property]);
										}
									} else {
										source = paramObject;
									}
								}
								process(source);
							}
					};
				}
			};
		}
	]
);