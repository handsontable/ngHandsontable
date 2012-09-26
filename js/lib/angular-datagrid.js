angular.module('StarcounterLib', [])
  .directive('uiDatagrid', function () {
    var directiveDefinitionObject = {
      restrict: 'A',
      compile: function compile(tElement, tAttrs, transclude) {

        var defaultOptions = {
          rows: 6,
          cols: 3,
          outsideClickDeselects: false,
          autoComplete: []
        };

        var $container = $('<div class="dataTable"></div>');

        return function postLink(scope, element, attrs, controller) {
          var expression = attrs.datarows;
          var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
            lhs, rhs, valueIdent, keyIdent;
          if (!match) {
            throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
              expression + "'.");
          }
          lhs = match[1];
          rhs = match[2];

          $(element).append($container);

          var options = {};
          var columns = [];
          var colHeaders = [];

          options = angular.extend({}, defaultOptions, options, scope.$eval(attrs.uiDatagrid));

          var i = 0;
          $(element).find('datacolumn').each(function (index) {
            var pattern = new RegExp("^(" + lhs + "\\.)");
            var name = $(this).attr('name').replace(pattern, '');
            var title = $(this).attr('title');
            var autoCompleteProvider = $(this).attr('options');
            columns.push({data: name});
            colHeaders.push(title);

            if (autoCompleteProvider) {
              options['autoComplete'].push({
                match: function (row, col) {
                  if (col === index) {
                    return true;
                  }
                },
                source: function (row, col) {
                  var childScope = scope.$new();
                  childScope.item = $container.data('handsontable').getData()[row];
                  var parsed = childScope.$eval(autoCompleteProvider);
                  return parsed;
                }
              })
            }
          });

          if (columns.length > 0) {
            options['columns'] = columns;
          }

          if (colHeaders.length > 0) {
            options['colHeaders'] = colHeaders;
          }

          $container.handsontable(options);

          $container.on('datachange.handsontable', function (event, changes, source) {
            if (source === 'loadData') {
              return;
            }
            scope.$apply(function () {
              scope.dataChange = !scope.dataChange;
            });
          });

          /*$container.on('selectionbyprop.handsontable', function (event, r, c, r2, c2) {
           var oldSel = scope.selectionChange;
           var newSel = [r, c, r2, c2];
           if (typeof oldSel === 'undefined' || oldSel[0] != newSel[0] || oldSel[1] != newSel[1] || oldSel[2] != newSel[2] || oldSel[3] != newSel[3]) {
           scope.$apply(function () {
           scope.selectionChange = newSel;
           });
           }
           });*/

          scope.$watch('dataChange', function (value) {
            $container.handsontable("loadData", scope[rhs]); //todo: after first iteration it is only used to rerender data
            scope.$emit('broadcastItems');
          });

          /*scope.$watch('selectionChange', function (value) {
           if (value) {
           $container.handsontable("selectCellByProp", value[0], value[1], value[2], value[3]);
           }
           });*/
        }
      }
    };
    return directiveDefinitionObject;
  });