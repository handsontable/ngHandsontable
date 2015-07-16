(function() {
  /**
   * Main Angular Handsontable directive
   */
  function hotTable(settingFactory, autoCompleteFactory, $rootScope) {
    return {
      restrict: 'EA',
      scope: settingFactory.getTableScopeDefinition(),
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
        scope.htSettings.hotId = attrs.hotId;
        scope.htSettings.data = scope.datarows;
        settingFactory.mergeSettingsFromScope(scope.htSettings, scope);
        settingFactory.mergeHooksFromScope(scope.htSettings, scope);

        if (scope.htSettings.columns) {
          for (var i = 0, length = scope.htSettings.columns.length; i < length; i++) {
            if (scope.htSettings.columns[i].type !== 'autocomplete') {
              continue;
            }
            if (typeof scope.htSettings.columns[i].optionList === 'string') {
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
            autoCompleteFactory.parseAutoComplete(scope.htSettings.columns[i], scope.datarows, true);
          }
        }

        console.log(scope.htSettings);

        scope.hotInstance = settingFactory.initializeHandsontable(element, scope.htSettings);

        var origAfterChange = scope.htSettings.afterChange;

        scope.htSettings.afterChange = function() {
          if (origAfterChange) {
            origAfterChange.apply(this, arguments);
          }
          if (!$rootScope.$$phase){
            scope.$apply();
          }
        };

        console.log(scope);

        //scope.$watchGroup(settingFactory.getAvailableSettings(), function(newValue, oldValue) {
        //  angular.forEach(settingFactory.getAvailableSettings(), function(key, index) {
        //    scope.htSettings[key] = newValue[index];
        //  });
        //
        //  console.log(scope.htSettings);
        //
        //  settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
        //});

        //angular.forEach(settingFactory.getAvailableSettings(), function(htSetting) {
        //  scope.$watch(htSetting, function(newValue, oldValue) {
        //
        //    console.log(htSetting, newValue);
        //
        //    scope.htSettings[htSetting] = newValue;
        //    //settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
        //  });
        //});

        //scope.$watchGroup(settingFactory.getAvailableSettings(), function(newValue, oldValue, name) {
        //    console.log(newValue, oldValue, name);
        //});

        /**
         * Check if settings has been changed
         */
        //if (attrs.columns) {
        //  scope.$watch('columns', function(newValue, oldValue) {
        //    scope.htSettings.columns = newValue;
        //    settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
        //  });
        //}

        /**
         * INITIALIZE DATA
         */
        //scope.$watch('datarows', function(newValue, oldValue) {
        //  if (oldValue && oldValue.length == scope.htSettings.minSpareRows && newValue.length != scope.htSettings.minSpareRows) {
        //    scope.htSettings.data = scope.datarows;
        //    settingFactory.updateHandsontableSettings(scope.hotInstance, scope.htSettings);
        //  }
        //});
      }
    };
  }
  hotTable.$inject = ['settingFactory', 'autoCompleteFactory', '$rootScope'];

  angular.module('ngHandsontable.directives').directive('hotTable', hotTable);
}());
