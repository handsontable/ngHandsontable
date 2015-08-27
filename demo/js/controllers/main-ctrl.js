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
