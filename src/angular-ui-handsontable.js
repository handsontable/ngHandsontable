angular.module('uiHandsontable', [])
  .directive('uiHandsontable', ['$compile', function ($compile) {
  var directiveDefinitionObject = {
    restrict: 'EA',
    compile: function compile(tElement, tAttrs, transclude) {

      var defaultSettings = {
        columns: [],
        colHeaders: true,
        outsideClickDeselects: false,
        autoComplete: []
      };

      var parseAutocomplete = function (scope, column, uiDatagrid) {
        var expression = column.optionList
          , match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/);
        if (!match) {
          throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }

        var lhs = match[1]
          , rhs = match[2]
          , deregister
          , deinterval
          , childScope = scope.$new()
          , lastItems
          , lastQuery;

        column.source = function (query, process) {
          if ($.trim(query) === lastQuery) {
            return;
          }
          lastQuery = $.trim(query);

          if (deregister) {
            deregister();
            clearInterval(deinterval);
          }
          var htInstance = uiDatagrid.$container.data('handsontable');
          var row = htInstance.getSelected()[0];
          childScope[uiDatagrid.lhs] = scope.$eval(uiDatagrid.rhs)[row];
          if (!column.saveOnBlur) {
            childScope.$eval(column.value + ' = "' + $.trim(query).replace(/"/g, '\"') + '"'); //refresh value after each key stroke
            childScope.$apply();
          }
          deinterval = setInterval(function () {
            childScope.item = htInstance.getData()[row];
            if (childScope.item) {
              childScope.$apply();
            }
            else {
              deregister();
              clearInterval(deinterval);
            }
          }, 100);
          deregister = childScope.$watch(rhs, function (newVal) {
            lastItems = newVal;
            if (process) {
              process(newVal);
            }
          }, true);
        };

        column.sorter = function (items) {
          return items;
        };

        column.highlighter = function (item) {
          var el;
          var optionScope = childScope.$new();
          optionScope[lhs] = item;
          if (column.linker) {
            column.linker(optionScope, function (elem) {
              el = elem[0];
              el.style.display = 'block';
            });
          }
          else {
            el = $compile('<span>' + column.optionTemplate + '</span>')(optionScope);
          }
          return el;
        };

        column.select = function () {
          var htInstance = uiDatagrid.$container.data('handsontable');
          if (this.$menu.find('.active').length) {
            var index = this.$menu.find('.active').index();
            childScope[lhs] = lastItems[index];
            htInstance.destroyEditor();
            childScope.$eval(column.clickrow);
          }
          else if (!column.strict) {
            htInstance.destroyEditor();
            childScope.$eval(column.value + ' = "' + $.trim(this.query).replace(/"/g, '\"') + '"'); //assign current textarea value
          }
          //htInstance.render();
          $('.handsontable').each(function () {
            $(this).handsontable('render');//render all Handsontables in the page
          });

          lastQuery = void 0;
          return this.hide();
        };
      }

      var $container = $('<div class="ui-handsontable-container"></div>');

      var expression = tAttrs.datarows
        , match
        , lhs
        , rhs;
      if (expression) {
        match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/)
      }
      if (!match) {
        throw Error("Expected datarows in form of '_item_ in _collection_' but got '" +
          expression + "'.");
      }
      lhs = match[1];
      rhs = match[2];
      tElement.data("uiDatagrid", {
        lhs: lhs,
        rhs: rhs,
        settings: angular.extend({}, defaultSettings),
        $container: $container
      });

      return function postLink(scope, element, attrs, controller) {
        var uiDatagrid = element.data("uiDatagrid");
        uiDatagrid.settings = angular.extend(uiDatagrid.settings, scope.$eval(attrs.uiHandsontable || attrs.settings));

        $(element).append($container);

        if (typeof scope[rhs] !== 'undefined') {
          uiDatagrid.settings['data'] = scope[rhs];
        }

        var pattern = new RegExp("^(" + lhs + "\\.)");
        for (var i = 0, ilen = uiDatagrid.settings.columns.length; i < ilen; i++) {
          uiDatagrid.settings.columns[i].data = uiDatagrid.settings.columns[i].value.replace(pattern, '');

          if (uiDatagrid.settings.columns[i].type === 'autocomplete') {
            parseAutocomplete(scope, uiDatagrid.settings.columns[i], uiDatagrid);
          }
        }

        $container.handsontable(uiDatagrid.settings);

        $container.on('datachange.handsontable', function (event, changes, source) {
          if (!scope.$$phase) { //if digest is not in progress
            scope.$apply(); //programmatic change does not trigger digest in AnuglarJS so we need to trigger it automatically
          }
        });

        $container.on('selectionbyprop.handsontable', function (event, r, p, r2, p2) {
          scope.$emit('datagridSelection', $container, r, p, r2, p2);
        });

        // set up watchers for visible part of the table
        scope.$watch(function () {
          //check if visible data has changed
          if (scope[rhs] !== $container.handsontable('getData')) {
            return true;
          }

          var out = ''
            , instance = $container.data('handsontable')
            , clen = instance.countCols();
          for (var r = instance.rowOffset(), rlen = r + instance.countVisibleRows(); r < rlen; r++) {
            for (var c = 0; c < clen; c++) {
              out += instance.getDataAtCell(r, c)
            }
          }
          return out;
        }, function (newVal, oldVal) {
          //if data has changed, render the table
          if (newVal == true) {
            $container.handsontable('loadData', scope[rhs]);
          }
          else if (newVal !== oldVal) {
            $container.handsontable('render');
          }
        }, false);

        scope.$watch(function () {
          //check if configuration has changed
          var config = scope.$eval(attrs.uiHandsontable || attrs.settings);
          return config.columns;
        }, function (newVal, oldVal) {
          //if data has changed, render the table
          $container.handsontable('updateSettings', {
            columns: uiDatagrid.settings.columns
          });
        }, true);
      }
    }
  };
  return directiveDefinitionObject;
}])
  .directive('datacolumn', function () {
    var directiveDefinitionObject = {
      restrict: 'E',
      priority: 500,
      compile: function compile(tElement, tAttrs, transclude) {

        var keys = [];
        for (var i in tAttrs) {
          if (tAttrs.hasOwnProperty(i)) {
            keys.push(i);
          }
        }

        tElement.data("uiDatagridColumn", {
          value: tAttrs.value,
          source: null,
          saveOnBlur: ($.inArray('saveonblur', keys) !== -1), //true if element has attribute 'saveonblur'
          strict: ($.inArray('strict', keys) !== -1) //true if element has attribute 'strict'
        });

        return function postLink(scope, element, attrs, controller) {
          var i;
          var uiDatagrid = element.inheritedData("uiDatagrid");

          var title = scope.$eval(attrs.title)
            , width = scope.$eval(attrs.width)
            , type = scope.$eval(attrs.type)
            , options = attrs.options;

          var childScope = scope.$new();

          var column = scope.$eval(options) || {};
          column.value = attrs.value;
          column.type = type;
          column.title = title;
          column.width = width;

          switch (type) {
            case 'autocomplete':
              var uiDatagridColumn = element.data("uiDatagridColumn");
              for (i in uiDatagridColumn) {
                if (uiDatagridColumn.hasOwnProperty(i)) {
                  column[i] = uiDatagridColumn[i];
                }
              }
              break;

            case 'checkbox':
              if (typeof attrs.checkedtemplate !== 'undefined') {
                column.checkedTemplate = scope.$eval(attrs.checkedtemplate); //if undefined then defaults to Boolean true
              }
              if (typeof attrs.uncheckedtemplate !== 'undefined') {
                column.uncheckedTemplate = scope.$eval(attrs.uncheckedtemplate); //if undefined then defaults to Boolean true
              }
              break;
          }

          if (typeof attrs.readonly !== 'undefined') {
            column.readOnly = true;
          }

          for (i in attrs) {
            if (attrs.hasOwnProperty(i)) {
              if (i.charAt(0) !== '$' && typeof column[i] === 'undefined') {
                column[i] = childScope.$eval(attrs[i]);
              }
            }
          }

          uiDatagrid.settings.columns.push(column);
        }
      }
    };
    return directiveDefinitionObject;
  })
  .directive('optionlist', function () {
    var directiveDefinitionObject = {
      restrict: 'E',
      transclude: 'element',
      priority: 510,
      compile: function compile(element, attr, linker) {

        return function postLink(scope, element, attrs, controller) {
          var uiDatagridColumn = element.inheritedData("uiDatagridColumn");
          uiDatagridColumn.optionList = attrs.datarows;
          uiDatagridColumn.clickrow = attrs.clickrow;
          uiDatagridColumn.linker = linker;
        }
      }
    };
    return directiveDefinitionObject;
  });