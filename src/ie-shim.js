/**
 * The below shim gives support to HTML elements <ui-handsontable>, <datacolumn>, <optionlist> in IE 8 and lower
 * See: http://tanalin.com/en/articles/ie-version-js/ for IE version feature detection
 */

if (document.all && !document.addEventListener) { // IE 8 and lower
  document.createElement('ui-handsontable');
  document.createElement('datacolumn');
  document.createElement('optionlist');
}