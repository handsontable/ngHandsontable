(function() {
  'use strict';

  var
    /**
     * @property _module
     * @static
     * @private
     */
    _module = null,

    /**
     * @property _namespace
     * @static
     * @private
     */
    _namespace = '',

    /**
     * @property _list
     * @static
     * @private
     * @type {Array}
     */
    _list = [],

    Modules;


  Modules = function Modules(namespace) {
    var angularNs;

    if (!(this instanceof Modules)) {
      return new Modules(namespace);
    }
    _namespace = namespace.replace(/\//g, '-');
    _namespace = _namespace.replace(/-\D/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
    angularNs = 'modules/' + _namespace;

    if (_list.indexOf(angularNs) === -1) {
      _list.push(angularNs);
      _module = angular.module(angularNs, []);
    } else {
      _module = angular.module(angularNs);
    }

    return this;
  };

  /**
   * @method register
   * @param {Array} modules
   */
  Modules.prototype.register = function(modules) {
    var _this = this;

    if (!angular.isArray(modules)) {
      modules = [modules];
    }
    angular.forEach(modules, function(module) {
      if (!angular.isFunction(module)) {
        throw Error('Registered module must be a function. Given ' + angular.identity(module));
      }
      module(_module, _this.path());
    });
  };

  /**
   * @method path
   * @return {Object}
   */
  Modules.prototype.path = function() {
    return {
      controller: function(name) {
        var ctrl = _namespace + name;

        ctrl = ctrl.substr(0, 1).toUpperCase() + ctrl.substr(1, ctrl.length - 1);

        return ctrl;
      }
    };
  };

  Modules.list = _list;

  module.exports = Modules;
}());
