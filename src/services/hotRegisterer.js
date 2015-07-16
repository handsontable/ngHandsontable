(function() {

  function hotRegisterer() {
    var instances = {};

    return {
      getInstance: function(id) {
        return instances[id];
      },

      registerInstance: function(id, instance) {
        if (!this.getInstance(id)) {
          instances[id] = instance;
        }
      }
    };
  }
  hotRegisterer.$inject = [];

  angular.module('ngHandsontable.services').factory('hotRegisterer', hotRegisterer);
}());
