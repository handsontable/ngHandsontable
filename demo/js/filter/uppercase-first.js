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
