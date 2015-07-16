(function() {
  function autoCompleteFactory() {
    return {
      parseAutoComplete: function(column, dataSet, propertyOnly) {
        column.source = function(query, process) {
          var row = this.instance.getSelected()[0];
          var source = [];
          var data = dataSet[row];

          if (!data) {
            return;
          }
          var options = column.optionList;

          if (!options.object) {
            return;
          }
          if (angular.isArray(options.object)) {
            source = options.object;
          } else {
            var
              objKeys = options.object.split('.'),
              paramObject = data;

            while (objKeys.length > 0) {
              var key = objKeys.shift();
              paramObject = paramObject[key];
            }

            if (propertyOnly) {
              for (var i = 0, length = paramObject.length; i < length; i++) {
                source.push(paramObject[i][options.property]);
              }
            } else {
              source = paramObject;
            }
          }
          process(source);
        };
      }
    };
  }
  autoCompleteFactory.$inject = [];

  angular.module('ngHandsontable.services').factory('autoCompleteFactory', autoCompleteFactory);
}());
