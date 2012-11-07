/**
 * https://github.com/warpech/angular-ui-handsontable
 */
angular.module('ui.directives', [])
  .directive('uiDatagrid', function () {
    var directiveDefinitionObject = {
      restrict: 'A',
      compile: function compile(tElement, tAttrs, transclude) {

        var defaultSettings = {
          startRows: 0,
          startCols: 3,
          outsideClickDeselects: false,
          autoComplete: []
        };

        var $container = $('<div class="dataTable"></div>');

        var expression = tAttrs.datarows;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
          lhs, rhs, valueIdent, keyIdent;
        if (!match) {
          throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        lhs = match[1];
        rhs = match[2];
        tElement.data("uiDatagrid", {
          lhs: lhs,
          colHeaders: [],
          columns: [],
          settings: angular.extend({}, defaultSettings),
          $container: $container
        });

        return function postLink(scope, element, attrs, controller) {
          var uiDatagrid = element.data("uiDatagrid");
          uiDatagrid.settings = angular.extend(uiDatagrid.settings, scope.$eval(attrs.uiDatagrid));

          $(element).append($container);

          if (typeof scope[rhs] !== 'undefined') {
            uiDatagrid.settings['data'] = scope[rhs];
            if (uiDatagrid.columns.length > 0) {
              uiDatagrid.settings['columns'] = uiDatagrid.columns;
              uiDatagrid.settings['startCols'] = uiDatagrid.columns.length;
            }
          }

          if (uiDatagrid.colHeaders.length > 0) {
            uiDatagrid.settings['colHeaders'] = uiDatagrid.colHeaders;
          }

          $container.handsontable(uiDatagrid.settings);

          $container.on('datachange.handsontable', function (event, changes, source) {
            if (!scope.$$phase) { //if digest is not in progress
              scope.$digest(); //programmatic change does not trigger digest in AnuglarJS so we need to trigger it automatically
            }
          });

          $container.on('selectionbyprop.handsontable', function (event, r, p, r2, p2) {
            scope.$emit('datagridSelection', $container, r, p, r2, p2);
          });

          scope.$watch(rhs, function (value) {
            if (scope[rhs] !== $container.handsontable('getData') && uiDatagrid.columns.length > 0) {
              $container.handsontable('updateSettings', {
                data: scope[rhs],
                columns: uiDatagrid.columns,
                startCols: uiDatagrid.columns.length
              });
            }
            else {
              $container.handsontable('loadData', scope[rhs]);
            }
          }, true);
        }
      }
    };
    return directiveDefinitionObject;
  })
  .directive('datacolumn', function () {
    var directiveDefinitionObject = {
      restrict: 'E',
      priority: 500,
      compile: function compile(tElement, tAttrs, transclude) {

        return function postLink(scope, element, attrs, controller) {
          var uiDatagrid = element.inheritedData("uiDatagrid");

          var pattern = new RegExp("^(" + uiDatagrid.lhs + "\\.)")
            , value = attrs.value.replace(pattern, '')
            , title = scope.$eval(attrs.title)
            , type = scope.$eval(attrs.type)
            , options = attrs.options
            , tmp;

          var childScope = scope.$new();

          var column = scope.$eval(options) || {};
          column.data = value;

          uiDatagrid.colHeaders.unshift(title);

          var deregister
            , deinterval;

          switch (type) {
            case 'autocomplete':
              column.type = Handsontable.AutocompleteCell;
              column.source = function (query, process) {
                if (deregister) {
                  deregister();
                  clearInterval(deinterval);
                }
                var parsed;
                var row = uiDatagrid.$container.data('handsontable').getSelected()[0];
                childScope.item = uiDatagrid.$container.data('handsontable').getData()[row];
                childScope.$eval(attrs.value + ' = "' + $.trim(query).replace(/"/g, '\"') + '"'); //refresh value after each key stroke
                childScope.$digest();
                deinterval = setInterval(function () {
                  scope.currentItem = childScope.item = uiDatagrid.$container.data('handsontable').getData()[row];
                  scope.$digest();
                  childScope.$digest();
                }, 100);
                deregister = childScope.$watch(options, function (oldVal, newVal) {
                  parsed = childScope.$eval(options)
                  if (process) {
                    process(parsed);
                  }
                }, true);
              };
              break;

            case 'checkbox':
              column.type = Handsontable.CheckboxCell;
              tmp = attrs.checkedtemplate;
              if (typeof tmp !== 'undefined') {
                column.checkedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
              }
              tmp = attrs.uncheckedtemplate;
              if (typeof tmp !== 'undefined') {
                column.uncheckedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
              }
              break;

            default:
              if (typeof type === 'object') {
                column.type = type;
              }
          }

          if (typeof attrs.readonly !== 'undefined') {
            column.readOnly = true;
          }

          for (var i in attrs) {
            if (attrs.hasOwnProperty(i) && i.charAt(0) !== '$' && typeof column[i] === 'undefined') {
              column[i] = childScope.$eval(attrs[i]);
            }
          }

          uiDatagrid.columns.unshift(column);
        }
      }
    };
    return directiveDefinitionObject;
  });