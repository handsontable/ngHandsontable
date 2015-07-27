(function() {
  'use strict';

  var modules = require('modules');

  MainCtrl.$inject = ['$state', 'demoMap'];


  function MainCtrl($state, demoMap) {
    this.allDemos = demoMap.getAll();
    this.selectedDemo = demoMap.get($state.current.name);
  }


  modules('app').register(function(module, path) {
    module.controller(path.controller('MainCtrl'), MainCtrl);
  });
}());
