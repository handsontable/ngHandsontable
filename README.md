# Angular UI directive for Handsontable

Enables creation of data grid applications in AngularJS.

## Demo

The current version should be deployed here: http://ng-datagrid.handsontable.com/split-screen.html

You can also clone this repo and run `split-screen.html` in your browser

## Usage

Include the library files (see [dist/](https://github.com/warpech/angular-ui-handsontable/tree/master/dist) directory):

```html
<script src="lib/angular.min.js"></script>
<script src="lib/jquery.min.js"></script>
<script src="dist/angular-ui-handsontable.full.js"></script>
<link rel="stylesheet" media="screen" href="dist/angular-ui-handsontable.full.css">
```

Template:

```html
<div ui-datagrid="{minSpareRows: 1}" datarows="item in items">
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
  
 Directive          | Attribute&nbsp;&nbsp;&nbsp; | Description
 -------------------|-----------------------------|-------------
 <div ui-datagrid>  |                             | Defines the grid container
 <div ui-datagrid>  | datarows                    | Data provier for the grid. Usage like `item in items` (similar to ngRepeat). Creates new scope for each row
 <datacolumn>       |                             | Defines a column in the grid
 <datacolumn>       | type                        | Column type. Possible values: `text`, `checkbox`, `autocomplete` (default: `text`)
 <datacolumn>       | value                       | Row property that will be used as data source for each cell
 <datacolumn>       | title                       | Column title
 <datacolumn>       | readOnly                    | If set, column will be read-only
 <datacolumn>       | live                        | (Autocomplete columns only) If set, `value` will be updated after each keystroke
 <datacolumn>       | strict                      | (Autocomplete columns only) If set, `value` can only be selected from autocomplete options. If not set, also custom `value` is allowed if entered to the text box
 <datacolumn>       | checkedTemplate             | (Checkbox columns only) Expression that will be used as the value for checked `checkbox` cell (default: boolean `true`)
 <datacolumn>       | uncheckedTemplate           | (Checkbox columns only) Expression that will be used as the value for unchecked `checkbox` cell (default: boolean `false`)

## Further development

This is not considered production ready. When the work is finished, contents of this repo will be submitted into https://github.com/warpech/angular-ui/