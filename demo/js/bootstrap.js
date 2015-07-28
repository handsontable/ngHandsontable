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

    app.constant('version', 'v@@version');
    app.config(config);

    angular.element(document).ready(function() {
      angular.bootstrap(document, [app.name], {
        strictDi: true
      });
    });
  };
}());
