angular.module('ngHandsontable.services', []);
angular.module('ngHandsontable.directives', []);
angular.module('ngHandsontable', [
    'ngHandsontable.services',
    'ngHandsontable.directives'
  ]);

Handsontable.hooks.add('afterContextMenuShow', function() {
  Handsontable.eventManager.isHotTableEnv = false;
});
