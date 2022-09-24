(function() {
  /**
   * Angular Handsontable directive for single column settings
   */
  function hotColumn(settingFactory) {
    return {
      restrict: 'EA',
      require: '^hotTable',
      scope: {},
      controller: ['$scope', function($scope) {
        this.setColumnOptionList = function(options) {
          if (!$scope.column) {
            $scope.column = {};
          }
          var optionList = {};
          var match = options.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/);

          if (match) {
            optionList.property = match[1];
            optionList.object = match[2];
          } else {
            optionList.object = options.split(',');
          }
          $scope.column.optionList = optionList;
        };
      }],
      compile: function(tElement, tAttrs) {
        var _this = this;

        this.scope = settingFactory.trimScopeDefinitionAccordingToAttrs(settingFactory.getColumnScopeDefinition(), tAttrs);
        //this.$$isolateBindings = {};

        angular.forEach(Object.keys(this.scope), function(key) {
          _this.$$isolateBindings[key] = {
            attrName: key,
            collection: false,
            mode: key === 'data' ? '@' : '=',
            optional: false
          };
        });

        return function(scope, element, attrs, controllerInstance) {
          var column = {};

          // Turn all attributes without value as `true` by default
          angular.forEach(Object.keys(attrs), function(key) {
            if (key.charAt(0) !== '$' && attrs[key] === '') {
              column[key] = true;
            }
          });
          settingFactory.mergeSettingsFromScope(column, scope);

          if (!scope.column) {
            scope.column = {};
          }
          angular.extend(scope.column, column);
          controllerInstance.setColumnSetting(scope.column);

          scope.$on('$destroy', function() {
            controllerInstance.removeColumnSetting(scope.column);
          });
        };
      }
    };
  }
  hotColumn.$inject = ['settingFactory'];

  angular.module('ngHandsontable.directives').directive('hotColumn', hotColumn);
}());
