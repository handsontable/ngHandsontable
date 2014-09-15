angular.module('ngHandsontable.services',[])
	.factory('settingFactory',[
		function () {

			return {
				/***
				 * Creates Handsontable settings object if needed
				 * @param element
				 * @returns {Object}
				 */
				getHandsontableSettings: function(element) {
					var uiDataGrid = element.data('uiDatagrid');
					if (!uiDataGrid) {
						uiDataGrid = {
							settings: {
								columns: [],
								colHeaders: true,
								outsideClickDeselects: true,
								autoComplete: []
							},
							$container: $('<div class="ui-handsontable-container"></div>')
						};
						element.data('uiDatagrid', uiDataGrid);
					}
					return uiDataGrid;
				},


				setHandsontableSettingsFromScope: function (htOptions, scopeOptions) {
					var i,
						settings = {};

					for (i in htOptions) {
						if (htOptions.hasOwnProperty(i) && typeof scopeOptions[htOptions[i]] !== 'undefined') {
							settings[htOptions[i]] = scopeOptions[htOptions[i]];
						}
					}
					console.log(settings);
					return settings;

				},

				/***
				 * Creates DataColumn settings object if needed
				 * @param element
				 * @return {Object}
				 */
				getDataColumnSettings: function (element) {
					var uiDataGridDataColumn = element.data('uiDatagridDatacolumn');
					if (!uiDataGridDataColumn) {
						uiDataGridDataColumn = {
						};
						element.data('uiDatagridDatacolumn', uiDataGridDataColumn);
					}
					return uiDataGridDataColumn;
				},

				getScopeDefinition: function (options) {
					var scopeDefinition = {
						selectedIndex: '=selectedindex',
						datarows: '='
					};

					for (var i = 0, length = options.length; i<length; i++) {
						scopeDefinition[options[i]] = '=' + options[i].toLowerCase();
					}

					return scopeDefinition;
				}
			}
		}
	]);