(function() {
  /**
   * Angular Handsontable directive for autocomplete settings
   */
  function hotAutocomplete() {
    return {
      restrict: 'EA',
      scope: true,
      require: '^hotColumn',
      link: function(scope, element, attrs, controllerInstance) {
        var options = attrs.datarows;

        controllerInstance.setColumnOptionList(options);
      }
    };
  }
  hotAutocomplete.$inject = [];

  angular.module('ngHandsontable.directives').directive('hotAutocomplete', hotAutocomplete);
}());
