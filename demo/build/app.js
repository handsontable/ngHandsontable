require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  'use strict';

  var APP_NAME = 'demos-app',
    modules = require('modules'),
    routing = require('routing'),
    demos = require('demos'),
    unique,
    app;


  unique = function(array) {
    var unique = [],
      len, i;

    for (i = 0, len = array.length; i < len; i++) {
      if (unique.indexOf(array[i]) === -1) {
        unique.push(array[i]);
      }
    }

    return unique;
  };
  window.App = {};
  window.App.bootstrap = function() {
    app = angular.module(APP_NAME, Array.prototype.concat(unique(modules.list), [
      'ui.router'
    ]));

    function config($sceDelegateProvider, $httpProvider, $stateProvider, $compileProvider, $urlRouterProvider, demoMapProvider) {
      $sceDelegateProvider.resourceUrlWhitelist(['self']);
      $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $compileProvider.debugInfoEnabled(false);

      demoMapProvider.setDemos(demos);
      routing($stateProvider, $urlRouterProvider, demoMapProvider);
    }
    config.$inject = ['$sceDelegateProvider', '$httpProvider', '$stateProvider', '$compileProvider', '$urlRouterProvider', 'demoMapProvider'];

    app.constant('version', 'v0.13.0');
    app.config(config);

    angular.element(document).ready(function() {
      angular.bootstrap(document, [app.name], {
        strictDi: true
      });
    });
  };
}());

},{"demos":"demos","modules":"modules","routing":"routing"}],2:[function(require,module,exports){
(function() {
  'use strict';

  var modules = require('modules');

  MainCtrl.$inject = ['$state', 'demoMap', 'version'];


  function MainCtrl($state, demoMap, version) {
    this.version = version;
    this.allDemos = demoMap.getAll();
    this.selectedDemo = demoMap.get($state.current.name);
  }


  modules('app').register(function(module, path) {
    module.controller(path.controller('MainCtrl'), MainCtrl);
  });
}());

},{"modules":"modules"}],3:[function(require,module,exports){
(function() {
  'use strict';

  var
    modules = require('modules'),

    DIRECTIVE_NAME = 'codePreview';

  CodePreview.$inject = [];


  function CodePreview() {
    return {
      restrict: 'EA',
      templateUrl: 'js/directives/code-preview.html',
      scope: {
        title: '='
      },
      link: function(scope, element, attr) {
        var iframe = element.find('iframe');

        iframe[0].src = attr[DIRECTIVE_NAME];
        iframe[0].style.minHeight = (window.innerHeight - iframe[0].getBoundingClientRect().top - 60) + 'px';
      }
    };
  }


  modules('app').register(function(module) {
    module.directive(DIRECTIVE_NAME, CodePreview);
  });
}());

},{"modules":"modules"}],4:[function(require,module,exports){
(function() {
  'use strict';

  var
    modules = require('modules');

  uppercaseFirst.$inject = [];


  function uppercaseFirst() {
    return function(string) {
      return string.substr(0, 1).toUpperCase() + string.substr(1, string.length);
    };
  }


  modules('app').register(function(module) {
    module.filter('uppercaseFirst', uppercaseFirst);
  });
}());

},{"modules":"modules"}],5:[function(require,module,exports){
(function() {
  var
    products = [
      {
        description: 'Big Mac',
        options: [
          {description: 'Big Mac'},
          {description: 'Big Mac & Co'},
          {description: 'McRoyal'},
          {description: 'Hamburger'},
          {description: 'Cheeseburger'},
          {description: 'Double Cheeseburger'}
        ]
      },
      {
        description: 'Fried Potatoes',
        options: [
          {description: 'Fried Potatoes'},
          {description: 'Fried Onions'}
        ]
      }
    ],
    firstNames = ['Ted', 'John', 'Macy', 'Rob', 'Gwen', 'Fiona', 'Mario', 'Ben', 'Kate', 'Kevin', 'Thomas', 'Frank'],
    lastNames = ['Tired', 'Johnson', 'Moore', 'Rocket', 'Goodman', 'Farewell', 'Manson', 'Bentley', 'Kowalski', 'Schmidt', 'Tucker', 'Fancy'],
    address = ['Turkey', 'Japan', 'Michigan', 'Russia', 'Greece', 'France', 'USA', 'Germany', 'Sweden', 'Denmark', 'Poland', 'Belgium'];

  function dataFactory() {
    return {
      generateArrayOfObjects: function(rows, keysToInclude) {
        var items = [], item;

        rows = rows || 10;

        for (var i = 0; i < rows; i++) {
          item = {
            id: i + 1,
            name: {
              first: firstNames[Math.floor(Math.random() * firstNames.length)],
              last: lastNames[Math.floor(Math.random() * lastNames.length)]
            },
            date: Math.max(Math.round(Math.random() * 12), 1) + '/' + Math.max(Math.round(Math.random() * 28), 1) + '/' + (Math.round(Math.random() * 80) + 1940),
            address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
            price: Math.floor(Math.random() * 100000) / 100,
            isActive: Math.floor(Math.random() * products.length) / 2 === 0 ? 'Yes' : 'No',
            product: angular.extend({}, products[Math.floor(Math.random() * products.length)])
          };
          angular.forEach(keysToInclude, function(key) {
            if (item[key]) {
              delete item[key];
            }
          });
          items.push(item);
        }

        return items;
      },

      generateArrayOfArrays: function(rows, cols) {
          return Handsontable.helper.createSpreadsheetData(rows || 10, cols || 10);
      }
    };
  }
  dataFactory.$inject = [];

  angular.module('ngHandsontable').service('dataFactory', dataFactory);
}());

},{}],6:[function(require,module,exports){
(function() {
  var
    modules = require('modules'),
    demos;

  function demoMap() {
    this.setDemos = function(_demos) {
      demos = _demos;
    };

    this.$get = function() {
      return {
        get: function(id) {
          var splited = id.split('-');

          return demos[splited[0]] ? demos[splited[0]][splited.splice(1, splited.length).join('-')] : null;
        },

        getAll: function() {
          return demos;
        },

        getFlatten: function() {
          var result = {};

          angular.forEach(Object.keys(demos), function(parent) {
            angular.forEach(Object.keys(demos[parent]), function(child) {
              result[parent + '-' + child] = demos[parent][child];
            });
          });

          return result;
        }
      };
    };
  }
  demoMap.$inject = [];

  modules('app').register(function(module) {
    module.provider('demoMap', demoMap);
  });
}());

},{"modules":"modules"}],"demos":[function(require,module,exports){
(function() {
  'use strict';

  var
    DEFAULT_TABS = 'html,js,output',
    BASE_URL = 'http://jsbin.com/{id}/embed?';

  function getUrl(id, tabs) {
    return BASE_URL.replace('{id}', id) + (tabs || DEFAULT_TABS);
  }

  module.exports = {
    'intro': {
      'simple-example': {
        url: getUrl('nudumu/4'),
        title: 'Simple example',
        description: 'Simple example'
      },
      'full-featured-demo': {
        url: getUrl('xezevi/3'),
        title: 'Full featured demo',
        description: 'Full featured demo'
      }
    },
    'configuration': {
      'configuration-by-object': {
        url: getUrl('getazu/3'),
        title: 'By `settings` object',
        description: 'Configuration by setting `settings` object'
      },
      'configuration-declarative-way': {
        url: getUrl('jupeme/3'),
        title: 'In declarative way',
        description: 'Configuration in declarative way'
      }
    },
    'columns': {
      'add-remove-column-ng-repeat': {
        url: getUrl('muluto/4'),
        title: 'Add/Remove (ng-repeat)',
        description: 'Add/Remove columns using ng-repeat'
      },
      'add-remove-column-by-attr': {
        url: getUrl('xayeru/3'),
        title: 'Add/Remove (`columns` attribute)',
        description: 'Add/Remove columns using `columns` attribute'
      }
    },
    'binding': {
      'data-binding': {
        url: getUrl('lupile/4'),
        title: 'Data binding',
        description: 'Data binding'
      },
      'settings-binding': {
        url: getUrl('xaqasi/3'),
        title: 'Table settings binding',
        description: 'Table settings binding'
      }
    },
    'callbacks': {
      'callbacks-by-object': {
        url: getUrl('nayito/5', 'html,js,console,output'),
        title: 'By `settings` object',
        description: 'Listening callbacks using `settings` object'
      },
      'callbacks-declarative-way': {
        url: getUrl('pucale/4', 'html,js,console,output'),
        title: 'In declarative way',
        description: 'Listening callbacks in declarative way'
      }
    },
    'plugins': {
      'copy-paste-context-menu': {
        url: getUrl('zohoge/2'),
        title: 'Enable copy/paste in context menu',
        description: 'Enable copy/paste in context menu'
      }
    },
    'pagination': {
      'rows-pagination': {
        url: getUrl('fohohenabo/1'),
        title: 'Paginate rows',
        description: 'Paginate rows'
      },
      'columns-pagination': {
        url: getUrl('qudufogafu/1'),
        title: 'Paginate columns',
        description: 'Paginate columns'
      },
    },
    'other': {
      'access-to-instance': {
        url: getUrl('fovoxu/4'),
        title: 'Access to Handsontable instance',
        description: 'Access to Handsontable instance'
      },
      'custom-validator': {
        url: getUrl('qoweju/3'),
        title: 'Custom validator',
        description: 'Custom validator'
      },
      'custom-renderer': {
        url: getUrl('locome/2'),
        title: 'Custom renderer',
        description: 'Custom renderer'
      },
    },
    'PRO': {
      'collapsing-columns-with-nested-headers': {
        url: getUrl('wilani/3'),
        title: 'Collapsing columns with nested headers',
        description: 'Create a nested, hierarchical structure of headers with expandable and collapsible columns'
      },
      'filtering-simple': {
        url: getUrl('fijida/3'),
        title: 'Data filtering (simple example)',
        description: 'Display rows that meet your criteria and hide the rest'
      },
      'filtering-external-inputs': {
        url: getUrl('rewefa/9'),
        title: 'Data filtering (external inputs)',
        description: 'Display rows that meet your criteria and hide the rest'
      },
      'hiding-columns': {
        url: getUrl('wapufa/2'),
        title: 'Hiding columns',
        description: 'Hide specific columns and show the rest'
      },
      'hiding-rows': {
        url: getUrl('roximi/3'),
        title: 'Hiding rows',
        description: 'Hide specific rows and show the rest'
      },
    },
  };
}());

},{}],"modules":[function(require,module,exports){
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

},{}],"routing":[function(require,module,exports){
(function() {
  'use strict';

  module.exports = function($stateProvider, $urlRouterProvider, demoMapProvider) {
    var map = demoMapProvider.$get().getFlatten();

    $urlRouterProvider.otherwise('/intro-simple-example');

    angular.forEach(Object.keys(map), function(key) {
      $stateProvider.state(key, {
          url: '/' + key,
          //templateUrl: 'js/templates/preview.html',
          views: {
            menu: {
              templateUrl: 'templates/menu.html',
              controller: 'AppMainCtrl as appCtrl'
            },
            preview: {
              templateUrl: 'templates/preview.html',
              controller: 'AppMainCtrl as appCtrl'
            }
          }
        });
    });
  };
}());

},{}]},{},[1,2,"demos",3,4,"modules","routing",5,6]);
