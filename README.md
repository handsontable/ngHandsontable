# Angular UI directive for Handsontable

The current version should be deployed here: http://ng-datagrid.handsontable.com/split-screen.html

You can also clone this repo and run `split-screen.html` in your browser

## Sample usage

Template:

```html
<div ui-datagrid datarows="item in items">
  <datacolumn value="item.id" title="ID"/>
  <datacolumn value="item.name.first" title="First Name"/>
  <datacolumn value="item.name.last" title="Last Name"/>
  <datacolumn value="item.address" title="Address"/>
  <datacolumn value="item.Product.Description" title="Favorite food" options="getOptions(item.Product.Options)"/></datacolumn>
  <datacolumn value="item.isActive" title="Is active" options="activeOptions"/>
</div>
```

Controller:

```javascript
$scope.activeOptions = ['Yes', 'No'];

$scope.items = [
  {id: 1, name: {first: "Marcin", last: "Warpechowski"}, address: "Schellingstr. 58, Muenchen", isActive: 'Yes', "Product": {
  "Description": "Big Mac",
	"Options": [
	  {"Description": "Big Mac"},
	  {"Description": "Big Mac & Co"}
	]}}
  //more items go here
];

$scope.getOptions = function (options) {
  var out = []
  if(typeof options === 'object' && options.length) {
	for (var i = 0, ilen = options.length; i < ilen; i++) {
	  out.push(options[i].Description);
	}
  }
  return out;
}
```

Please note that in the above example, the `item.Product.Description` column has autocomplete options returned by a function defined in the controller.

Whereas `item.isActive` column has autocomplete options defined directly in the parental scope.
  
## Elements and attributes in use  
  
 Element       | Attribute&nbsp;&nbsp;&nbsp; | Description
 --------------|-----------------------------|-------------
 div           | ui-datagrid                 | Defines the grid container
 div           | datarows                    | Data provier for the grid. Usage like `item in items` (similar to ngRepeat). Creates new scope for each row
 datacolumn    |                             | Defines a column in the grid
 datacolumn    | value                       | Row property that will be used as data source for each cell
 datacolumn    | title                       | Column title
 datacolumn    | options                     | (Optional) Expression that returns array of possible cell values

## Further development

This is not considered production ready. When the work is finished, contents of this repo will be submitted into https://github.com/warpech/angular-ui/