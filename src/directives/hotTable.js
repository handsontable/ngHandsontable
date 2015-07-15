(function() {
  /**
   * Main Angular Handsontable directive
   */
  function hotTable(settingFactory, autoCompleteFactory, $rootScope, $parse) {
    var publicProperties = Object.keys(Handsontable.DefaultSettings.prototype),
      publicHooks = Handsontable.hooks.getRegistered(),
      htOptions = publicProperties.concat(publicHooks);

    return {
      restrict: 'EA',
      scope: settingFactory.getScopeDefinition(htOptions),
      controller: ['$scope', function ($scope) {
        this.setColumnSetting = function (column) {
          if (!$scope.htSettings) {
            $scope.htSettings = {};
          }
          if (!$scope.htSettings.columns) {
            $scope.htSettings.columns = [];
          }
          $scope.htSettings.columns.push(column);
        };
      }],
      link: function (scope, element, attrs) {
        if (!scope.htSettings) {
          scope.htSettings = {};
        }
        scope.htSettings.data = scope.datarows;

        angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope));

        scope.hotInstance = settingFactory.initializeHandsontable(element, scope.htSettings);

        if(scope.htSettings.columns) {
          for (var i = 0, length = scope.htSettings.columns.length; i < length; i++) {

            if (scope.htSettings.columns[i].type == 'autocomplete') {
              if(typeof scope.htSettings.columns[i].optionList === 'string'){
                var optionList = {};
                var match = scope.htSettings.columns[i].optionList.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
                if (match) {
                  optionList.property = match[1];
                  optionList.object = match[2];
                } else {
                  optionList.object = optionList;
                }
                scope.htSettings.columns[i].optionList = optionList;
              }

              autoCompleteFactory.parseAutoComplete(scope.hotInstance, scope.htSettings.columns[i], scope.datarows, true);
            }
          }
          scope.hotInstance.updateSettings(scope.htSettings);
        }

        scope.htSettings.afterChange = function () {
          if (!$rootScope.$$phase){
            scope.$apply();
          }
        };

        var columnSetting = attrs.columns;

        /**
         * Check if settings has been changed
         */
        scope.$parent.$watch(
          function () {

            var settingToCheck = scope.$parent;

            if (columnSetting) {
              return angular.toJson($parse(columnSetting)(settingToCheck));
            }

          },
          function () {
            angular.extend(scope.htSettings, settingFactory.setHandsontableSettingsFromScope(htOptions, scope.$parent));
            settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);

          }
        );

        /**
         * Check if data has been changed
         */
        scope.$parent.$watch(
          function () {
            var objToCheck = scope.$parent;

            return angular.toJson($parse(attrs.datarows)(objToCheck));
          },
          function () {
            settingFactory.renderHandsontable(scope.hotInstance);
          }
        );

        /**
         * INITIALIZE DATA
         */
        scope.$watch('datarows', function (newValue, oldValue) {
          if (oldValue && oldValue.length == scope.htSettings.minSpareRows && newValue.length != scope.htSettings.minSpareRows) {
            scope.htSettings.data = scope.datarows;
            settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
          }
        });
      }
    };
  }
  hotTable.$inject = ['settingFactory', 'autoCompleteFactory', '$rootScope', '$parse'];

  angular.module('ngHandsontable.directives').directive('hotTable', hotTable);
}());
