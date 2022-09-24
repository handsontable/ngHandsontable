(function() {
  function autoCompleteFactory($parse) {
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

          if (!options || !options.object) {
            return;
          }
          if (angular.isArray(options.object)) {
            source = options.object;
          } else {
            // Using $parse to evaluate the expression against the row object
            // allows us to support filters like the ngRepeat directive does.
            var paramObject = $parse(options.object)(data);

            if (angular.isArray(paramObject)) {
              if (propertyOnly) {
                for (var i = 0, length = paramObject.length; i < length; i++) {
                  var item = paramObject[i][options.property];

                  if (item !== null && item !== undefined) {
                    source.push(item);
                  }
                }
              } else {
                source = paramObject;
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
  autoCompleteFactory.$inject = ['$parse'];

  angular.module('ngHandsontable.services').factory('autoCompleteFactory', autoCompleteFactory);
}());
