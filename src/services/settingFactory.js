(function() {

  function hyphenate(string) {
    return string.replace(/[A-Z]/g, function(match) {
      return ('-' + match.charAt(0).toLowerCase());
    });
  }

  function camelCase(string) {
    return string.replace(/-\D/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  }

  function ucFirst(string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1, string.length - 1);
  }

  function settingFactory(hotRegisterer) {
    return {
      containerClassName: 'handsontable-container',

      /**
       * Append handsontable container div and initialize handsontable instance inside element.
       *
       * @param {qLite} element
       * @param {Object} htSettings
       */
      initializeHandsontable: function(element, htSettings) {
        var container = document.createElement('div'),
          hot;

        container.className = this.containerClassName;

        if (htSettings.hotId) {
          container.id = htSettings.hotId;
        }
        element[0].appendChild(container);
        hot = new Handsontable(container, htSettings);

        if (htSettings.hotId) {
          hotRegisterer.registerInstance(htSettings.hotId, hot);
        }

        return hot;
      },

      /**
       * Set new settings to handsontable instance.
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
       * Render handsontable instance inside element.
       *
       * @param {Handsontable} instance
       */
      renderHandsontable: function(instance) {
        if (instance) {
          instance.render();
        }
      },

      /**
       * Merge original handsontable settings with setting defined in scope.
       *
       * @param {Object} settings
       * @param {Object} scope
       * @returns {Object}
       */
      mergeSettingsFromScope: function(settings, scope) {
        var
          scopeOptions = angular.extend({}, scope),
          htOptions, i, length;

        settings = settings || {};
        angular.extend(scopeOptions, scope.settings || {});
        htOptions = this.getAvailableSettings();

        for (i = 0, length = htOptions.length; i < length; i++) {
          if (typeof scopeOptions[htOptions[i]] !== 'undefined') {
            settings[htOptions[i]] = scopeOptions[htOptions[i]];
          }
        }

        return settings;
      },

      /**
       * Merge original handsontable hooks with hooks defined in scope.
       *
       * @param {Object} settings
       * @param {Object} scope
       * @returns {Object}
       */
      mergeHooksFromScope: function(settings, scope) {
        var
          scopeOptions = angular.extend({}, scope),
          htHooks, i, length, attribute;

        settings = settings || {};
        angular.extend(scopeOptions, scope.settings || {});
        htHooks = this.getAvailableHooks();

        for (i = 0, length = htHooks.length; i < length; i++) {
          attribute = 'on' + ucFirst(htHooks[i]);

          if (typeof scopeOptions[htHooks[i]] === 'function' || typeof scopeOptions[attribute] === 'function') {
            settings[htHooks[i]] = scopeOptions[htHooks[i]] || scopeOptions[attribute];
          }
        }

        return settings;
      },

      /**
       * Trim scope definition according to attrs object from directive.
       *
       * @param {Object} scopeDefinition
       * @param {Object} attrs
       * @returns {Object}
       */
      trimScopeDefinitionAccordingToAttrs: function(scopeDefinition, attrs) {
        for (var i in scopeDefinition) {
          if (scopeDefinition.hasOwnProperty(i) && attrs[i] === void 0 &&
              attrs[scopeDefinition[i].substr(1, scopeDefinition[i].length)] === void 0) {
            delete scopeDefinition[i];
          }
        }

        return scopeDefinition;
      },

      /**
       * Get isolate scope definition for main handsontable directive.
       *
       * @return {Object}
       */
      getTableScopeDefinition: function() {
        var scopeDefinition = {};

        this.applyAvailableSettingsScopeDef(scopeDefinition);
        this.applyAvailableHooksScopeDef(scopeDefinition);

        scopeDefinition.datarows = '=';
        scopeDefinition.dataschema = '=';
        scopeDefinition.observeDomVisibility = '=';
        //scopeDefinition.settings = '=';

        return scopeDefinition;
      },

      /**
       * Get isolate scope definition for column directive.
       *
       * @return {Object}
       */
      getColumnScopeDefinition: function() {
        var scopeDefinition = {};

        this.applyAvailableSettingsScopeDef(scopeDefinition);
        scopeDefinition.data = '@';

        return scopeDefinition;
      },

      /**
       * Apply all available handsontable settings into object which represents scope definition.
       *
       * @param {Object} [scopeDefinition]
       * @returns {Object}
       */
      applyAvailableSettingsScopeDef: function(scopeDefinition) {
        var options, i, length;

        options = this.getAvailableSettings();

        for (i = 0, length = options.length; i < length; i++) {
          scopeDefinition[options[i]] = '=';
        }

        return scopeDefinition;
      },

      /**
       * Apply all available handsontable hooks into object which represents scope definition.
       *
       * @param {Object} [scopeDefinition]
       * @returns {Object}
       */
      applyAvailableHooksScopeDef: function(scopeDefinition) {
        var options, i, length;

        options = this.getAvailableHooks();

        for (i = 0, length = options.length; i < length; i++) {
          scopeDefinition[options[i]] = '=on' + ucFirst(options[i]);
        }

        return scopeDefinition;
      },

      /**
       * Get all available settings from handsontable, returns settings by default in camelCase mode.
       *
       * @param {Boolean} [hyphenateStyle=undefined] If `true` then returns options in hyphenate mode (eq. row-header)
       * @returns {Array}
       */
      getAvailableSettings: function(hyphenateStyle) {
        var settings = Object.keys(Handsontable.DefaultSettings.prototype);

        if (settings.indexOf('contextMenuCopyPaste') === -1) {
          settings.push('contextMenuCopyPaste');
        }
        if (settings.indexOf('handsontable') === -1) {
          settings.push('handsontable');
        }
        if (settings.indexOf('settings') >= 0) {
          settings.splice(settings.indexOf('settings'), 1);
        }
        if (hyphenateStyle) {
          settings = settings.map(hyphenate);
        }

        return settings;
      },

      /**
       * Get all available hooks from handsontable, returns hooks by default in camelCase mode.
       *
       * @param {Boolean} [hyphenateStyle=undefined] If `true` then returns hooks in hyphenate mode (eq. on-after-init)
       * @returns {Array}
       */
      getAvailableHooks: function(hyphenateStyle) {
        var settings = Handsontable.hooks.getRegistered();

        if (hyphenateStyle) {
          settings = settings.map(function(hook) {
            return 'on-' + hyphenate(hook);
          });
        }

        return settings;
      }
    };
  }
  settingFactory.$inject = ['hotRegisterer'];

  angular.module('ngHandsontable.services').factory('settingFactory', settingFactory);
}());
