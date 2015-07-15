(function() {
  /**
   * Angular Handsontable directive for single column settings
   */
  function hotColumn() {
    return {
      restrict: 'E',
      require: '^hotTable',
      scope: {},
      controller: ['$scope', function ($scope) {
        this.setColumnOptionList = function (options) {
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

        for (var i in attributes) {
          if (attributes.hasOwnProperty(i)) {
            if (i.charAt(0) !== '$' && typeof column[i] === 'undefined') {
              if (i === 'data') {
                column.data = attributes[i];
              }
              else {
                column[i] = scope.$eval(attributes[i]);
              }
            }
          }
        }

        switch (column.type) {
          case 'checkbox':
            if (typeof attributes.checkedtemplate !== 'undefined') {
              column.checkedTemplate = scope.$eval(attributes.checkedtemplate); //if undefined then defaults to Boolean true
            }
            if (typeof attributes.uncheckedtemplate !== 'undefined') {
              column.uncheckedTemplate = scope.$eval(attributes.uncheckedtemplate); //if undefined then defaults to Boolean true
            }
            break;
        }

        if (typeof attributes.readonly !== 'undefined') {
          column.readOnly = true;
        }
        if (!scope.column) {
          scope.column = {};
        }

        angular.extend(scope.column, column);
        controllerInstance.setColumnSetting(scope.column);
      }
    };
  }
  hotColumn.$inject = [];

  angular.module('ngHandsontable.directives').directive('hotColumn', hotColumn);
}());
