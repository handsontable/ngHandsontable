# ngHandsontable - the AngularJS directive for [Handsontable](https://github.com/handsontable/handsontable) [![Build Status](https://travis-ci.org/handsontable/ngHandsontable.png?branch=master)](https://travis-ci.org/handsontable/ngHandsontable)

Enables creation of data grid applications in AngularJS.

## Demo

See the demo at http://handsontable.github.io/ngHandsontable.

## Usage

Include the library files:

```html
<link rel="stylesheet" media="screen" href="bower_components/handsontable/dist/handsontable.full.css">
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/handsontable/dist/handsontable.full.js"></script>
<script src="dist/ngHandsontable.js"></script>
```

Include component to your app:

```js
angular.module('my-app', ['ngHandsontable']);
```

Template:

```html
<hot-table settings="{colHeaders: colHeaders, contextMenu: ['row_above', 'row_below', 'remove_row'], afterChange: afterChange}"
           row-headers="false"
           min-spare-rows="minSpareRows"
           datarows="db.items"
           height="300"
           width="700">
    <hot-column data="id" title="'ID'"></hot-column>
    <hot-column data="name.first" title="'First Name'" type="grayedOut" read-only></hot-column>
    <hot-column data="name.last" title="'Last Name'" type="grayedOut" read-only></hot-column>
    <hot-column data="address" title="'Address'" width="150"></hot-column>
    <hot-column data="product.description" title="'Favorite food'" type="'autocomplete'">
        <hot-autocomplete datarows="description in product.options"></hot-autocomplete>
    </hot-column>
    <hot-column data="price" title="'Price'" type="'numeric'" width="80" format="'$ 0,0.00'"></hot-column>
    <hot-column data="isActive" title="'Is active'" type="'checkbox'" width="65" checked-template="'Yes'" unchecked-template="'No'"></hot-column>
</hot-table>
```

Controller:

```javascript
$scope.db.items = [
  {
    "id": 1,
    "name": {
      "first": "John",
      "last": "Schmidt"
    },
    "address": "45024 France",
    "price": 760.41,
    "isActive": "Yes",
    "product": {
      "description": "Fried Potatoes",
      "options": [
        {
          "description": "Fried Potatoes",
          "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
        },
        {
          "description": "Fried Onions",
          "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png"
        }
      ]
    }
  },
  //more items go here
];
```
  
## Directives and attributes specification

Main directive for creating table is `<hot-table>`. For defining column options you can use settings object with 
columns property. If you want to describe column behavior in declarative way you can add `<hot-column>` directive 
as a children of `<hot-table>` element and add all neccessary attributes to describe column options.

All **Handsontable** options listed [here](http://docs.handsontable.com/Options.html) should be supported. 
Options in camelCase mode should be passed to the directive in hyphenate mode e.q `autoWrapCol: true` -> `<hot-table auto-wrap-col>`.

It's recommended to put all your settings in one big object (`settings="ctrl.settings"`).
Settings attribute unlike any other attributes is not watched so using this can be helpful to achieve higher performance.

## License

The MIT License (see the [LICENSE](https://github.com/handsontable/ngHandsontable/blob/master/LICENSE) file for the full text)
