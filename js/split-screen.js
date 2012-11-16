/**
 * Below module declaration is used in ui.html
 */
angular.module('uiApp', ['ui', 'uiHandsontable']);

/**
 * Below controller declaration is used in ui.html and split-screen.html
 */
function MyCtrl($scope, $filter) {
  $scope.items = [
    {id: 1, name: {first: "Marcin", last: "Warpechowski"}, address: "Schellingstr. 58, Muenchen", isActive: 'Yes', "Product": {
      "Description": "Big Mac",
      "Options": [
        {"Description": "Big Mac", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "Big Mac & Co", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
      ]}},
    {id: 2, name: {first: "John", last: "Irving"}, address: "Chengdu Road, Wanhua, Taipei 108", isActive: 'Yes', "Product": {
      "Description": "Fried Potatoes",
      "Options": [
        {"Description": "Fried Potatoes", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
        {"Description": "Fried Onions", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
      ]}},
    {id: 3, name: {first: "Jeremy", last: "Springsteen"}, address: "4 New York Plaza, New York, NY 10004", isActive: 'Yes', "Product": {
      "Description": "McRoyal",
      "Options": [
        {"Description": "McRoyal", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "McRoyal with Cheese", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
      ]}}
  ];

  $scope.dumpItems = function () {
    console.log("dump items", $scope.items);
  };

  $scope.grayedOut = {
    renderer: function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.TextCell.renderer.apply(this, arguments);
      td.style.color = '#777';
    }
  };

  /**
   * Filter
   */

  $scope.$watch('query', function (newVal, oldVal) {
    $scope.filteredItems = $filter('filter')($scope.items, $scope.query);
  });
  $scope.filteredItems = $scope.items;

  /**
   * Selection
   */

  $scope.currentSelection = "None";

  $scope.$on('datagridSelection', function (scope, $container, r, p, r2, p2) {
    var ht = $container.data('handsontable');
    var str = "row '" + r + "' col '" + ht.propToCol(p) + "' (prop '" + p + "')";
    if (r !== r2 && p !== p2) {
      str = "From " + str + " to row '" + r2 + "' col '" + ht.propToCol(p2) + "' (prop '" + p2 + "')";
    }
    $scope.$apply(function () {
      $scope.currentSelection = str;
    });
  });
}