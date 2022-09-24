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
