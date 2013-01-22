# Angular UI directive for Handsontable

Enables creation of data grid applications in AngularJS.

## Demo

The current version should be deployed here: http://ng-datagrid.handsontable.com/split-screen.html

You can also clone this repo and run `split-screen.html` in your browser

## Usage

Include the library files (see [dist/](https://github.com/warpech/angular-ui-handsontable/tree/master/dist) directory):

```html
<script src="lib/jquery.min.js"></script>
<script src="lib/angular.min.js"></script>
<script src="dist/angular-ui-handsontable.full.js"></script>
<link rel="stylesheet" media="screen" href="dist/angular-ui-handsontable.full.css">
```

Template:

```html
<div minSpareRows="1" datarows="item in items">
  <datacolumn value="item.id" title="'ID'"></datacolumn>
  <datacolumn type="grayedOut" value="item.name.first" title="'First Name'" readOnly></datacolumn>
  <datacolumn type="grayedOut" value="item.name.last" title="'Last Name'" readOnly></datacolumn>
  <datacolumn value="item.address" title="'Address'"></datacolumn>
  <datacolumn value="item.Product.Description" title="'Favorite food'" type="'autocomplete'" live strict>
    <optionlist datarows="option in item.Product.Options"
                clickrow="item.Product.Description = option.Description">
      <img src="{{option.Image}}" style="width: 16px; height: 16px; border-width: 0">
      {{option.Description}}
    </optionlist>
  </datacolumn>
  <datacolumn type="'checkbox'" value="item.isActive" title="'Is active'" checkedTemplate="'Yes'"
              uncheckedTemplate="'No'"></datacolumn>
</div>
```

Controller:

```javascript
$scope.items = [
  {
    id: 1,
    name: {
      first: "Marcin",
      last: "Warpechowski"
    },
    address: "Marienplatz 11, Munich",
    isActive: "Yes",
    Product: {
      Description: "Big Mac",
	    Options: [
	      {Description: "Big Mac"},
	      {Description: "Big Mac & Co"}
	    ]
	  }
	}
  //more items go here
];
```

Please note that in the above example, the `item.Product.Description` column has autocomplete options returned by a function defined in the controller.

Whereas `item.isActive` column has autocomplete options defined directly in the parental scope.
  
## Directives and attributes specification

All **Handsontable** attributes listed [here](https://github.com/warpech/jquery-handsontable) should be supported (namely: width, height, rowHeaders, colHeaders, colWidths, columns, cells, dataSchema, contextMenu, onSelection, onSelectionByProp, onBeforeChange, onChange, onCopyLimit, startRows, startCols, minRows, minCols, maxRows, maxCols, minSpareRows, minSpareCols, multiSelect, fillHandle, undo, outsideClickDeselects, enterBeginsEditing, enterMoves, tabMoves, autoWrapRow, autoWrapCol, copyRowsLimit, copyColsLimit, currentRowClassName, currentColClassName, asyncRendering, stretchH, columnSorting)
  
 Directive                       | Attribute&nbsp;&nbsp;&nbsp; | Description
 --------------------------------|-----------------------------|-------------
 **&lt;div ui-handsontable&gt;** |                             | Defines the grid container. Can also be declared as element `<ui-handsontable>`
 &lt;div ui-handsontable&gt;     | datarows                    | Data provider for the grid. Usage like `item in items` (similar to ngRepeat). Creates new scope for each row
 &lt;div ui-handsontable&gt;     | settings                    | jquery-handsontable settings. For list of options, see: [warpech/jquery-handsontable](https://github.com/warpech/jquery-handsontable)
 &lt;div ui-handsontable&gt;     | selectedIndex               | Allows to bind a scope variable to get/set selected row index
 **&lt;datacolumn&gt;**          |                             | Defines a column in the grid
 &lt;datacolumn&gt;              | type                        | Column type. Possible values: `text`, `checkbox`, `autocomplete` (default: `text`)
 &lt;datacolumn&gt;              | value                       | Row property that will be used as data source for each cell
 &lt;datacolumn&gt;              | title                       | Column title
 &lt;datacolumn&gt;              | readOnly                    | If set, column will be read-only
 &lt;datacolumn&gt;              | saveOnBlur                  | (Autocomplete columns only) If set, `value` will be updated after autocomplete is blured. This is in contrast to default behavior, where `value` is updated after each keystroke
 &lt;datacolumn&gt;              | strict                      | (Autocomplete columns only) If set, `value` can only be selected from autocomplete options. If not set, also custom `value` is allowed if entered to the text box
 &lt;datacolumn&gt;              | checkedTemplate             | (Checkbox columns only) Expression that will be used as the value for checked `checkbox` cell (default: boolean `true`)
 &lt;datacolumn&gt;              | uncheckedTemplate           | (Checkbox columns only) Expression that will be used as the value for unchecked `checkbox` cell (default: boolean `false`)

## Further development

This is not considered production ready. When the work is finished, contents of this repo will be submitted into https://github.com/warpech/angular-ui/