(function() {
  /**
   * Angular Handsontable directive for single column settings
   */
  function hotColumn(settingFactory) {
    return {
      restrict: 'E',
      require: '^hotTable',
      scope: settingFactory.getColumnScopeDefinition(),
      controller: ['$scope', function ($scope) {
        this.setColumnOptionList = function(options) {
          if (!$scope.column) {
            $scope.column = {};
          }
          var optionList = {};
          var match = options.match(/^\s*(.+)\s+in\s+(.*)\s*$/);

          if (match) {
            optionList.property = match[1];
            optionList.object = match[2];
          } else {
            optionList.object = options.split(',');
          }
          $scope.column['optionList'] = optionList;
        };
      }],
      link: function (scope, element, attributes, controllerInstance) {
        var column = {};

        settingFactory.mergeSettingsFromScope(column, scope);

        if (!scope.column) {
          scope.column = {};
        }
        angular.extend(scope.column, column);
        controllerInstance.setColumnSetting(scope.column);
      }
    };
  }
  hotColumn.$inject = ['settingFactory'];

  angular.module('ngHandsontable.directives').directive('hotColumn', hotColumn);
}());
