# Changelog

##0.1.1-dev

- now the template inside `optionlist` is compiled along with inner Angular directives
- now you can use the uiHandsontable directive as attribute `<div ui-handsontable="settings">` or element `<ui-handsontable settings="settings">` (both are used in split-screen.html)
- split-screen.html now uses `img ng-src` instead of `img src` so that there is no request to the server for the unparsed "{{option.Image}}" path

##0.1.0

Changes since Nov 5, 2012:

- now Angular UI Handsontable is built with Grunt
- 2 distributions (in [dist/](https://github.com/warpech/angular-ui-handsontable/tree/master/dist) directory): full and full.min (for development purposes I think it is better to use full for now)
- directive name changed to `ui-handsontable` to follow the scheme that Angular UI is using
- new directive `optionlist` that includes the autocomplete row template inside