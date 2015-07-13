angular.module('ngHandsontable.services', [])
  .factory('settingFactory', [
    function () {
      return {
        containerClassName: 'handsontable-container',

        /**
         * Append handsontable container div and initialize handsontable instance inside element
         *
         * @param element
         * @param htSettings
         */
        initializeHandsontable: function (element, htSettings) {
          var container = document.createElement('DIV');

          container.className = this.containerClassName;
          element[0].appendChild(container);

          return new Handsontable(container, htSettings);
        },

        /**
         * Set new settings to handsontable instance
         *
         * @param instance
         * @param settings
         */
        updateHandsontableSettings: function (instance, settings) {
          if (instance) {
            instance.updateSettings(settings);
          }
        },

        /**
         * Render handsontable instance inside element
         *
         * @param instance
         */
        renderHandsontable: function (instance) {
          if (instance) {
            instance.render();
          }
        },

        /**
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

        /**
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
  .factory('autoCompleteFactory', [
    function () {
      return {
        parseAutoComplete: function (instance, column, dataSet, propertyOnly) {
          column.source = function (query, process) {
            var row = instance.getSelected()[0];
            var source = [];
            var data = dataSet[row];

            if (data) {
              var options = column.optionList;
              if (options.object) {
                if (angular.isArray(options.object)) {
                  source = options.object;
                } else {
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
            }
          };
        }
      };
    }
  ]
);
