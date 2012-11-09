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
          lhs, rhs;
        if (!match) {
          throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        lhs = match[1];
        rhs = match[2];
        tElement.data("uiDatagrid", {
          lhs: lhs,
          rhs: rhs,
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

          scope.$watch(rhs, function (newVal) {
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

        tElement.data("uiDatagridAutocomplete", {
          value: tAttrs.value,
          source: null
        });

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

          uiDatagrid.colHeaders.push(title);

          switch (type) {
            case 'autocomplete':
              column.type = Handsontable.AutocompleteCell;
              var uiDatagridAutocomplete = element.data("uiDatagridAutocomplete");
              for (var i in uiDatagridAutocomplete) {
                if (uiDatagridAutocomplete.hasOwnProperty(i)) {
                  column[i] = uiDatagridAutocomplete[i];
                }
              }
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

          uiDatagrid.columns.push(column);
        }
      }
    };
    return directiveDefinitionObject;
  })
  .directive('optionlist', ['$interpolate', function ($interpolate) {
  var directiveDefinitionObject = {
    restrict: 'E',
    compile: function compile(tElement, tAttrs, transclude, linker) {

      var tpl = $.trim(tElement.html());
      tElement.remove();

      return function postLink(scope, element, attrs, controller) {
        var uiDatagridAutocomplete = element.inheritedData("uiDatagridAutocomplete");
        var uiDatagrid = element.inheritedData("uiDatagrid");

        var expression = attrs.datarows;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
          lhs, rhs;
        if (!match) {
          throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        lhs = match[1];
        rhs = match[2];

        var deregister
          , deinterval;

        var childScope = scope.$new();

        var interpolateFn = $interpolate(tpl);

        var lastItems;
        var lastQuery;

        uiDatagridAutocomplete.source = function (query, process) {
          if ($.trim(query) === lastQuery) {
            return;
          }
          lastQuery = $.trim(query);

          if (deregister) {
            deregister();
            clearInterval(deinterval);
          }
          var row = uiDatagrid.$container.data('handsontable').getSelected()[0];
          childScope[uiDatagrid.lhs] = scope.$eval(uiDatagrid.rhs)[row];
          childScope.$eval(uiDatagridAutocomplete.value + ' = "' + $.trim(query).replace(/"/g, '\"') + '"'); //refresh value after each key stroke
          childScope.$digest();
          deinterval = setInterval(function () {
            scope.currentItem = childScope.item = uiDatagrid.$container.data('handsontable').getData()[row];
            scope.$digest();
            childScope.$digest();
          }, 100);
          deregister = childScope.$watch(rhs, function (newVal, oldVal) {
            lastItems = newVal;
            if (process) {
              process(newVal);
            }
          }, true);
        };

        uiDatagridAutocomplete.sorter = function (items) {
          return items;
        };

        uiDatagridAutocomplete.highlighter = function (item) {
          childScope[lhs] = item;
          return interpolateFn(childScope);
        };

        uiDatagridAutocomplete.select = function () {
          if (this.$menu.find('.active').length) {
            var index = this.$menu.find('.active').index();
            childScope[lhs] = lastItems[index];
            var instance = uiDatagrid.$container.data('handsontable');
            instance.destroyEditor();
            childScope.$eval(attrs.clickrow);
          }

          lastQuery = void 0;
          return this.hide();
        };
      }
    }
  };
  return directiveDefinitionObject;
}]);