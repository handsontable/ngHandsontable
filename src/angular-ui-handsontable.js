angular.module('uiHandsontable', [])
  .directive('uiHandsontable', ['$compile', function ($compile) {
  var htOptions = ['data', 'width', 'height', 'rowHeaders', 'colHeaders', 'colWidths', 'columns', 'cells', 'dataSchema', 'contextMenu', 'onSelection', 'onSelectionByProp', 'onBeforeChange', 'onChange', 'onCopyLimit', 'startRows', 'startCols', 'minRows', 'minCols', 'maxRows', 'maxCols', 'minSpareRows', 'minSpareCols', 'multiSelect', 'fillHandle', 'undo', 'outsideClickDeselects', 'enterBeginsEditing', 'enterMoves', 'tabMoves', 'autoWrapRow', 'autoWrapCol', 'copyRowsLimit', 'copyColsLimit', 'currentRowClassName', 'currentColClassName', 'asyncRendering', 'stretchH', 'columnSorting'];

  var scopeDef = {
    selectedIndex: '=selectedindex'
  };
  for (var i = 0, ilen = htOptions.length; i < ilen; i++) {
    scopeDef[htOptions[i]] = '=' + htOptions[i].toLowerCase();
  }

  var directiveDefinitionObject = {
    restrict: 'EA',
    scope: scopeDef,
    priority: 490,
    compile: function compile(tElement, tAttrs) {

      var defaultSettings = {
        columns: [],
        colHeaders: true,
        outsideClickDeselects: true,
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
          childScope[uiDatagrid.lhs] = scope.$parent.$eval(uiDatagrid.rhs)[row];
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
      };

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

      return function postLink(scope, element, attrs) {
        var uiDatagrid = element.data("uiDatagrid")
          , i
          , ilen;
        uiDatagrid.settings = angular.extend(uiDatagrid.settings, scope.$parent.$eval(attrs.uiHandsontable || attrs.settings));

        for (i in htOptions) {
          if (typeof scope[htOptions[i]] !== 'undefined') {
            uiDatagrid.settings[htOptions[i]] = scope[htOptions[i]];
          }
        }

        //console.log('uiDatagrid.settings', uiDatagrid.settings);

        $(element).append($container);

        if (typeof scope.$parent[rhs] !== 'undefined') {
          uiDatagrid.settings['data'] = scope.$parent[rhs];
        }

        if (uiDatagrid.settings.columns) {
          var pattern = new RegExp("^(" + lhs + "\\.)");
          for (i = 0, ilen = uiDatagrid.settings.columns.length; i < ilen; i++) {
            uiDatagrid.settings.columns[i].data = uiDatagrid.settings.columns[i].value.replace(pattern, '');

            if (uiDatagrid.settings.columns[i].type === 'autocomplete') {
              parseAutocomplete(scope, uiDatagrid.settings.columns[i], uiDatagrid);
            }
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

        // set up watcher for visible part of the table
        scope.$watch(function () {
          //check if visible data has changed
          if (scope.$parent[rhs] !== $container.handsontable('getData')) {
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
            $container.handsontable('loadData', scope.$parent[rhs]);
          }
          else if (newVal !== oldVal) {
            $container.handsontable('render');
          }
        }, false);

        // set up watchers for settings
        for (i = 0, ilen = htOptions.length; i < ilen; i++) {
          (function (key) {
            scope.$watch(key, function (newVal, oldVal) {
              //if configuration has changed, call updateSettings
              //console.log(key, 'changed value to ', newVal);
              if (newVal === oldVal) {
                return;
              }

              if (key === 'columns') {
                var pattern = new RegExp("^(" + lhs + "\\.)");
                for (var i = 0, ilen = newVal.length; i < ilen; i++) {
                  newVal[i].data = newVal[i].value.replace(pattern, '');

                  if (newVal[i].type === 'autocomplete') {
                    parseAutocomplete(scope, newVal[i], uiDatagrid);
                  }
                }
              }

              var obj = {};
              obj[key] = newVal;
              $container.handsontable('updateSettings', obj);
            }, true);
          })(htOptions[i]);
        }
      }
    }
  };
  return directiveDefinitionObject;
}])
  .directive('datacolumn', function () {
    var directiveDefinitionObject = {
      restrict: 'E',
      priority: 500,
      compile: function compile(tElement, tAttrs) {

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

        return function postLink(scope, element, attrs) {
          var i;
          var uiDatagrid = element.inheritedData("uiDatagrid");

          var title = scope.$parent.$eval(attrs.title)
            , width = scope.$parent.$eval(attrs.width)
            , type = scope.$parent.$eval(attrs.type)
            , options = attrs.options;

          var childScope = scope.$new();

          var column = scope.$parent.$eval(options) || {};
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
                column.checkedTemplate = scope.$parent.$eval(attrs.checkedtemplate); //if undefined then defaults to Boolean true
              }
              if (typeof attrs.uncheckedtemplate !== 'undefined') {
                column.uncheckedTemplate = scope.$parent.$eval(attrs.uncheckedtemplate); //if undefined then defaults to Boolean true
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

        return function postLink(scope, element, attrs) {
          var uiDatagridColumn = element.inheritedData("uiDatagridColumn");
          uiDatagridColumn.optionList = attrs.datarows;
          uiDatagridColumn.clickrow = attrs.clickrow;
          uiDatagridColumn.linker = linker;
        }
      }
    };
    return directiveDefinitionObject;
  })
  .directive('selectedindex', function () {
    var directiveDefinitionObject = {
      restrict: 'A',
      priority: 491,
      compile: function compile() {

        return function postLink(scope, element) {
          var uiDatagrid = element.data("uiDatagrid")
            , $container = uiDatagrid.$container;

          var isSelected
          , lastSelectionRow
          , lastSelectionCol;

          $container.on('selection.handsontable', function (event, r, c, r2, c2) {
            isSelected = true;
            lastSelectionRow = r;
            lastSelectionCol = c;

            if (!scope.$$phase && typeof scope.selectedIndex !== 'undefined' && scope.selectedIndex != r) { //if digest is not in progress
              scope.$apply(function () {
                scope.selectedIndex = r;
              });
            }
          });

          $container.on('deselect.handsontable', function (event) {
            isSelected = false;
            lastSelectionRow = null;

            if (!scope.$$phase && typeof scope.selectedIndex !== 'undefined' && scope.selectedIndex !== null) { //if digest is not in progress
              scope.$apply(function () {
                scope.selectedIndex = null;
              });
            }
          });

          // set up watcher for selectedIndex
          scope.$watch('selectedIndex', function (newVal, oldVal) {
            //if selectedIndex has changed, change table selection
            var row = newVal * 1; //convert to numeric
            if (typeof newVal !== 'undefined' && newVal !== null && row !== lastSelectionRow) {
              var col = lastSelectionCol || 0;
              $container.handsontable('selectCell', row, col, row, col, true);
            }
          }, false);
        }
      }
    };
    return directiveDefinitionObject;
  });