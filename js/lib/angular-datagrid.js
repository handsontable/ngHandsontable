angular.module('StarcounterLib', [])
  .directive('uiDatagrid', function () {
    var directiveDefinitionObject = {
      restrict: 'A',
      compile: function compile(tElement, tAttrs, transclude) {

        var defaultSettings = {
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

            switch(type) {
              case 'autocomplete':
                settings['autoComplete'].push({
                  match: function (row, col) {
                    if (col === index) {
                      return true;
                    }
                  },
                  source: function (row, col) {
                    var childScope = scope.$new();
                    childScope.item = $container.data('handsontable').getData()[row];
                    var parsed = childScope.$eval(options);
                    return parsed;
                  }
                });
                break;

              case 'checkbox':
                column.type = Handsontable.CheckboxCell;
                tmp = $this.attr('checkedTemplate');
                if(typeof tmp !== 'undefined') {
                  column.checkedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
                }
                tmp = $this.attr('uncheckedTemplate');
                if(typeof tmp !== 'undefined') {
                  column.uncheckedTemplate = scope.$eval(tmp); //if undefined then defaults to Boolean true
                }
                break;

              default:
                if(typeof type === 'object') {
                  column.type = type;
                }
            }

            if($this.attr('readOnly')) {
              column.readOnly = true;
            }

            columns.push(column);
          });

          if (columns.length > 0) {
            settings['columns'] = columns;
          }

          if (colHeaders.length > 0) {
            settings['colHeaders'] = colHeaders;
          }

          settings['data'] = scope[rhs];
          $container.handsontable(settings);

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