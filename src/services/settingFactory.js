(function() {
  function serviceFactory() {
    return {
      containerClassName: 'handsontable-container',

      /**
       * Append handsontable container div and initialize handsontable instance inside element
       *
       * @param {qLite} element
       * @param {Object} htSettings
       */
      initializeHandsontable: function(element, htSettings) {
        var container = document.createElement('DIV');

        container.className = this.containerClassName;
        element[0].appendChild(container);

        return new Handsontable(container, htSettings);
      },

      /**
       * Set new settings to handsontable instance
       *
       * @param {Handsontable} instance
       * @param {Object} settings
       */
      updateHandsontableSettings: function(instance, settings) {
        if (instance) {
          instance.updateSettings(settings);
        }
      },

      /**
       * Render handsontable instance inside element
       *
       * @param {Handsontable} instance
       */
      renderHandsontable: function(instance) {
        if (instance) {
          instance.render();
        }
      },

      /**
       * @param {Array} htOptions
       * @param {Object} scopeOptions
       * @return {Object}
       */
      setHandsontableSettingsFromScope: function(htOptions, scopeOptions) {
        var
          settings = {},
          allOptions = angular.extend({}, scopeOptions),
          i, length;

        angular.extend(allOptions, scopeOptions.settings);
        length = htOptions.length;

        for (i = 0; i < length; i++) {
          if (typeof allOptions[htOptions[i]] !== 'undefined') {
            settings[htOptions[i]] = allOptions[htOptions[i]];
          }
        }

        return settings;
      },

      /**
       * @param {Array} options
       * @return {{datarows: String("="), settings: String("=")}}
       */
      getScopeDefinition: function(options) {
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
  serviceFactory.$inject = [];

  angular.module('ngHandsontable.services').factory('settingFactory', serviceFactory);
}());
