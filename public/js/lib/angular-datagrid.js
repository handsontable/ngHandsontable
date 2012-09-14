angular.module('StarcounterLib', [])
  .directive('datagrid', function () {
    var directiveDefinitionObject = {
      restrict:'EA',
      require:'?ngModel',
      compile:function compile(tElement, tAttrs, transclude) {

        var container = $('<div class="dataTable"></div>');

        return function postLink(scope, element, attrs, controller) {
          //console.log('postLink', transclude, element);

          $(element).append(container);

          $(container).handsontable({
            rows:6,
            cols:3,
            outsideClickDeselects:false,
            onChange:function (changes, source) {
              //console.log("onChange", scope[attrs.ngModel], source);
              if (source === 'loadData') {
                return;
              }
              scope.$apply(function () {
                var model = scope[attrs.ngModel];
                for (var i = 0, ilen = changes.length; i < ilen; i++) {
                  if (typeof model[changes[i][0]] === 'undefined') {
                    model[changes[i][0]] = [];
                  }
                  model[changes[i][0]][changes[i][1]] = changes[i][3];
                }
                //scope[attrs.ngModel] = $(container).handsontable("getData");
                scope.dataChange = !scope.dataChange;
              });
            },
            onSelection:function (r, c, r2, c2) {
              //console.log("onSelection", arguments);
              var oldSel = scope.selectionChange;
              var newSel = arguments;
              if (typeof oldSel === 'undefined' || oldSel[0] != newSel[0] || oldSel[1] != newSel[1] || oldSel[2] != newSel[2] || oldSel[3] != newSel[3]) {
                scope.$apply(function () {
                  scope.selectionChange = newSel;
                });
              }
            }
          });

          scope.$watch('dataChange', function (value) {
            console.log($(element).attr('id'), "triggered dataChange", value);
            $(container).handsontable("loadData", scope[attrs.ngModel]);
            scope.$emit('broadcastItems');
          });

          scope.$watch('selectionChange', function (value) {
            //console.log($(element).attr('id'), "triggered selectionChange", value);
            if (value) {
              $(container).handsontable("selectCell", value[0], value[1], value[2], value[3]);
            }
          });

          scope.$on('incomingItems', function() {
            $(container).handsontable("loadData", scope[attrs.ngModel]);
          });
        }
      }
    };
    return directiveDefinitionObject;
  });