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
