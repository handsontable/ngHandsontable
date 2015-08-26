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
    '$parse',
    function ($parse) {
      return {
        parseAutoComplete: function (scope, i) {
          var column = scope.htSettings.columns[i];
          column.source = function (query, process) {
            var row = scope.hotInstance.getSelected()[0];
            var data = scope.datarows[row];
            if (data) {
              var options = column.optionList;
              if (options.object) {
                if (angular.isArray(options.object)) {
                  process(options.object);
                } else {
                  // I would normally just pass the string into $watchCollection,
                  // but using the result of $parse allows us to evaluate the
                  // expression against the row object, which is the only way to
                  // parse the options correctly. ($parse supports filtering,
                  // just like $watchCollection - $watchCollection actually uses
                  // $parse behind the scenes.)
                  var parsedExpr = $parse(options.object);

                  var updateOptions = function (datarow) {
                    var collection = parsedExpr(datarow);
                    var source = [];
                    if (collection && collection.length) {
                      for (var j = 0; j < collection.length; j++) {
                        item = collection[j][options.property];
                        if (item) {
                          source.push(item);
                        }
                      }
                    }
                    process(source);
                  };

                  // set initial options
                  // We have to call this function manually first. If we depend
                  // on $watch to initialize the options, it will wait until
                  // the end of the current execution stack to run it and thus
                  // cause the autocomplete to be rendered without the options
                  // the first time.
                  updateOptions(data);

                  scope.$watch('datarows['+row+']',
                    updateOptions,
                    true // deep watch to pick up changes to options
                  );
                }
              }
            }
          };
        }
      };
    }
  ]
);
