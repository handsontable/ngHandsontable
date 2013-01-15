# Changelog

## 0.3.0-dev (Jan 14, 2013, not final)

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