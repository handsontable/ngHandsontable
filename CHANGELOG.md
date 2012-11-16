# Changelog

## 0.1.3-dev

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