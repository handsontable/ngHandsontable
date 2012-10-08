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

          $(element).find('datacolumn').each(function (index) {
            var pattern = new RegExp("^(" + lhs + "\\.)");
            var value = $(this).attr('value').replace(pattern, '');
            var title = $(this).attr('title');
            var autoCompleteProvider = $(this).attr('options');
            columns.push({data: value});
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

          options['data'] = scope[rhs];
          $container.handsontable(options);

          $container.on('datachange.handsontable', function (event, changes, source) {
            if (source === 'loadData') {
              return;
            }
            scope.$apply(function () {
              scope.dataChange = !scope.dataChange;
            });
          });

          $container.on('selectionbyprop.handsontable', function (event, r, p, r2, p2) {
            scope.$emit('datagridSelection', $container, r, p, r2, p2);
          });

          scope.$watch('dataChange', function (value) {
            $container.handsontable("loadData", scope[rhs]);
          });
        }
      }
    };
    return directiveDefinitionObject;
  });