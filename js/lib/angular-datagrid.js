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

          var settings = angular.extend({}, defaultSettings, scope.$eval(attrs.uiDatagrid));
          var columns = [];
          var colHeaders = [];

          $(element).find('datacolumn').each(function (index) {
            var $this = $(this)
              , pattern = new RegExp("^(" + lhs + "\\.)")
              , value = $this.attr('value').replace(pattern, '')
              , title = $this.attr('title')
              , type = scope.$eval($this.attr('type'))
              , options = $this.attr('options')
              , tmp;

            var column = scope.$eval(options) || {};
            column.data = value;

            colHeaders.push(title);

            var deregister
              , deinterval;

            switch (type) {
              case 'autocomplete':
                settings['autoComplete'].push({
                  match: function (row, col) {
                    if (col === index) {
                      return true;
                    }
                  },
                  source: function (row, col) {
                    var fn;
                    if (deregister) {
                      deregister();
                      clearInterval(deinterval);
                    }
                    var parsed;
                    var childScope = scope.$new();
                    childScope.item = $container.data('handsontable').getData()[row];
                    deinterval = setInterval(function () {
                      childScope.item = $container.data('handsontable').getData()[row];
                      childScope.$digest();
                    }, 100);
                    deregister = childScope.$watch(options, function (oldVal, newVal) {
                      parsed = childScope.$eval(options)
                      if (fn) {
                        fn(parsed);
                      }
                    }, true);
                    return function (query, process) {
                      fn = process;
                      if (parsed) {
                        fn(parsed);
                      }
                    }
                  }
                });
                break;

              case 'checkbox':
                column.type = Handsontable.CheckboxCell;
                tmp = $this.attr('checkedTemplate');
                if (typeof tmp !== 'undefined') {
                  column.checkedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
                }
                tmp = $this.attr('uncheckedTemplate');
                if (typeof tmp !== 'undefined') {
                  column.uncheckedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
                }
                break;

              default:
                if (typeof type === 'object') {
                  column.type = type;
                }
            }

            if (typeof $this.attr('readOnly') !== 'undefined') {
              column.readOnly = true;
            }

            if (typeof $this.attr('live') !== 'undefined') {
              column.live = true;
            }

            columns.push(column);
          });

          if (typeof scope[rhs] !== 'undefined') {
            settings['data'] = scope[rhs];
            if (columns.length > 0) {
              settings['columns'] = columns;
              settings['startCols'] = columns.length;
            }
          }

          if (colHeaders.length > 0) {
            settings['colHeaders'] = colHeaders;
          }

          $container.handsontable(settings);

          $container.on('datachange.handsontable', function (event, changes, source) {
            if (source !== 'loadData') {
              scope[rhs + '_deepChangeInfo'] = changes;
            }
            if (!scope.$$phase) { //if digest is not in progress
              scope.$digest(); //programmatic change does not trigger digest in AnuglarJS so we need to trigger it automatically
            }
          });

          $container.on('selectionbyprop.handsontable', function (event, r, p, r2, p2) {
            scope.$emit('datagridSelection', $container, r, p, r2, p2);
          });

          scope.$watch(rhs, function (value) {
            if (scope[rhs] !== $container.handsontable('getData') && columns.length > 0) {
              $container.handsontable('updateSettings', {
                data: scope[rhs],
                columns: columns,
                startCols: columns.length
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
  });