## 0.3.17 (Oct 1, 2013)

Upgrade Handsontable to 0.9.19 (see [changelog](https://github.com/warpech/jquery-handsontable/blob/master/CHANGELOG.md))

Includes:
- improved native vertical scrollbar (use directive `scrollbarModelV="'native'"`)
- new plugin hook `afterRenderer`

## 0.3.16 (Aug 22, 2013)

Upgrade Handsontable to 0.9.14 (see [changelog](https://github.com/warpech/jquery-handsontable/blob/master/CHANGELOG.md))

## 0.3.15 (Jul 31, 2013)

Fix a bug introduced in 0.3.14 (some of the options were not correct).

## 0.3.14 (Jul 31, 2013)

Allow all Handsontable options introduced in few recent versions, e.g. `fragmentSelection` (see [Options](https://github.com/warpech/jquery-handsontable/wiki/Options))

## 0.3.13 (Jul 29, 2013)

Other:
- upgrade Handsontable to 0.9.11 (see [changelog](https://github.com/warpech/jquery-handsontable/blob/master/CHANGELOG.md))

## 0.3.12 (Jul 23, 2013)

Other:
- upgrade Handsontable to 0.9.10 (see [changelog](https://github.com/warpech/jquery-handsontable/blob/master/CHANGELOG.md))

## 0.3.11 (Jun 17, 2013)

Other:
- upgrade Handsontable to 0.9.5

## 0.3.10 (Jun 12, 2013)

Other:
- define Handsontable as Bower dependency
- upgrade Handsontable to 0.9.4

## 0.3.9 (May 15, 2013)

Bugfix:
- fix "Cannot read property 'offsetLeft' of undefined at WalkontableDom.offset" issue when using UI Bootstrap <tabs>

Other:
- upgrade Handsontable to 0.9-beta2

## 0.3.8 (May 12, 2013)

Bugfix:
- fix "$digest already in progress" issue when using UI Bootstrap <tabs>
- fix "firstChild not found" issue when using UI Bootstrap <tabs>

Other:
- upgrade Handsontable to 0.9-beta1 (dev branch)

## 0.3.7 (May 3, 2013)

Bugfix:
- `ui-handsontable` did not work when placed inside [UI Bootstrap](http://angular-ui.github.io/bootstrap/) `<tabs>` directive
- added tabs.html demo that uses UI Bootstrap

Other:
- upgrade Handsontable to 0.8.23

## 0.3.6 (Mar 26, 2013)

Feature:
- split-screen.html demo now uses all available space in window

Other:
- upgrade Handsontable to 0.8.16

## 0.3.5 (Mar 24, 2013)

Bugfix:
- `datarows` crashed when trying to use deep object structure as the data source (`datarows="row in sql.Rows"`)

## 0.3.4 (Mar 4, 2013)

Bugfix:
- fix problems with autocomplete cell type and Angular Patch integration

Other:
- upgrade Handsontable to 0.8.8
- upgrade AngularJS to 1.0.5

## 0.3.3 (Feb 28, 2013)

Features:
- new numeric cell type
- make autocomplete selection much faster

Other:
- upgrade Handsontable to 0.8.6
- upgrade jQuery to 1.9.1
- upgrade build system to Grunt 0.4.0 (read instructions how to upgrade here: http://gruntjs.com/upgrading-from-0.3-to-0.4)

## 0.3.2 (Jan 23, 2013)

Bugfixes:
- upgrade Handsontable to 0.8.3
- fix "Non-assignable model expression" error when `selectedIndex` attribute was a primitive number, not a object property reference
- when starting with 0 rows, then adding a new row, table was not rerendered
- column stretching did not work with 0 rows
- horizontal scrollbar was shown with 0 rows

## 0.3.1 (Jan 21, 2013)

Features:
- new syntax supported. Handsontable attributes should now be passed at directive attributes (eg. `minSpareRows="1"`)
- in addition to the above, the attributes may be dynamic variables that will be observed for changes (eg. `columns="myColumns"`)
- new attribute `selectedIndex` allows to bind a scope variable to get/set selected row index

Bugfixes:
- `onChange` callback is called before any other events when clicked outside of the grid
- column stretching does not flicker when scrolling in IE, FF, Opera
- clicking outside of table finishes editing of the cell

## 0.3.0 (Jan 14, 2013)

Features:
- highlight currently highlighted row
- manual column resize
- column autosize when double clicked on the manual column resize handle
- column stretching
- column sorting
* table now automatically fits the container when window is resized

Known issues:
- last column flickers when scrolling in IE, FF, Opera
- first example on split-screen.html uses whole screen witdh if "width" parameter is not provided (width: 640)

## 0.2.0 (Jan 7, 2013)

- virtual rendering fixes and optimizations (upgrade to Handsontable 0.8.2)
- show only relevant scrollbars
- dynamic columns defined in split-screen.js

## 0.2-beta3 (Dec 19, 2012)

- virtual rendering fixes and optimizations
- watch for changes only in visible part of the table

## 0.2-beta2 (Dec 13, 2012)

- numerous virtual rendering fixes and optimizations
- defining column widths using the `width` attribute

## 0.2-beta1 (Dec 6, 2012)

- virtual rendering allowing for big number of editable rows

## 0.1.5 (Nov 22, 2012)

- fix for removing rows in data source

## 0.1.4 (Nov 19, 2012)

- cell border is now always rerendered after editing
- upgrade Handsontable to 0.7.5-dev

## 0.1.3 (Nov 16, 2012)

- changed module name to `uiHandsontable` to avoid conflict with Angular UI
- created demo page `ui.html` to test cooperability with Angular UI

## 0.1.2 (Nov 16, 2012)

- now propagates changes correctly if data source comes from parent scope (changed scope.$digest to scope.$apply)
- IE 8 shim now is included in `full` and `full.min` JavaScript packages
- upgrade Handsontable to 0.7.4-dev
- removed `live` attribute from autocomplete (it is now always assumed). Introduced `saveOnBlur` attribute which has the opposite behavior than `live`

## 0.1.1 (Nov 13, 2012)

- now the template inside `optionlist` is compiled along with inner Angular directives
- now you can use the uiHandsontable directive as attribute `<div ui-handsontable="settings">` or element `<ui-handsontable settings="settings">` (both are used in split-screen.html)
- split-screen.html now uses `img ng-src` instead of `img src` so that there is no request to the server for the unparsed "{{option.Image}}" path

## 0.1.0 (Nov 12, 2012)

Changes since Nov 5, 2012:

- now Angular UI Handsontable is built with Grunt
- 2 distributions (in [dist/](https://github.com/warpech/angular-ui-handsontable/tree/master/dist) directory): full and full.min (for development purposes I think it is better to use full for now)
- directive name changed to `ui-handsontable` to follow the scheme that Angular UI is using
- new directive `optionlist` that includes the autocomplete row template inside