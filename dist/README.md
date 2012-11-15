# Angular UI Handsontable distributions

## Bare distribution

If you are a "Bob the Builder" kind of hacker, you will need to load Angular UI Handsontable JS, CSS and their dependecies.

```html
<script src="lib/angular.min.js"></script>
<script src="lib/jquery.min.js"></script>
<script src="src/ie-shim.js"></script>
<script src="src/angular-ui-handsontable.js"></script>
<script src="src/3rdparty/handsontable/jquery.handsontable.full.js"></script>
<link rel="stylesheet" media="screen" href="src/3rdparty/handsontable/jquery.handsontable.full.css">
```

This way is generally not recommended and you are advised to use the Full or Minified distribution instead.

## Full distribution

To save your effort, the above code can be shortened by using the **full** distribution of Angular UI Handsontable:

```html
<script src="lib/angular.min.js"></script>
<script src="lib/jquery.min.js"></script>
<script src="dist/angular-ui-handsontable.full.js"></script>
<link rel="stylesheet" media="screen" href="dist/angular-ui-handsontable.full.css">
```

Using this has the same effect as loading all the dependencies from the **bare** distribution.

## Minified distribution

For production environments, you can use the minified distribution.
It is the same as **full** distribution but the JS and CSS files are minified.

```html
<script src="lib/angular.min.js"></script>
<script src="lib/jquery.min.js"></script>
<script src="dist/angular-ui-handsontable.full.min.js"></script>
<link rel="stylesheet" media="screen" href="dist/angular-ui-handsontable.full.min.css">
```

The JS file is minified with [grunt](https://github.com/gruntjs/grunt) / [UglifyJS](https://github.com/mishoo/UglifyJS).
The CSS file is minified with [grunt-css](https://github.com/jzaefferer/grunt-css) / [Sqwish](https://github.com/ded/sqwish).