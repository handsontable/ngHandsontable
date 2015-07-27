(function() {

  function hotRegisterer() {
    var instances = {};

    return {
      getInstance: function(id) {
        return instances[id];
      },

      registerInstance: function(id, instance) {
        instances[id] = instance;
      },

      removeInstance: function(id) {
        instances[id] = void 0;
      }
    };
  }
  hotRegisterer.$inject = [];

  angular.module('ngHandsontable.services').factory('hotRegisterer', hotRegisterer);
}());
