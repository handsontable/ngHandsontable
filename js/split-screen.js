/**
 * Below module declaration is used in ui.html
 */
angular.module('uiApp', ['ui.select2', 'uiHandsontable']);
angular.module('uiAppWithTabs', ['uiHandsontable', 'ui.bootstrap']);

/**
 * Below controller declaration is used in ui.html and split-screen.html
 */
function MyCtrl($scope, $filter) {

  var $window = $(window);
  var winHeight = $window.height();
  var winWidth = $window.width();
  $window.resize(function () {
    winHeight = $window.height();
    winWidth = $window.width();
  });

  $scope.calcHeight = function () {
    var border = 12;
    var topOffset = $("#example1").offset().top;
    var height = winHeight - topOffset - 2 * border;
    if (height < 50) {
      return 50;
    }
    return height;
  };

  $scope.calcWidth = function () {
    var border = 12;
    var leftOffset = $("#example1").offset().left;
    var width = winWidth - leftOffset - 2 * border;
    if (width < 50) {
      return 50;
    }
    return width;
  };

  var products = [
    {
      "Description": "Big Mac",
      "Options": [
        {"Description": "Big Mac", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "Big Mac & Co", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "McRoyal", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "Hamburger", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "Cheeseburger", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"Description": "Double Cheeseburger", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
      ]
    },
    {
      "Description": "Fried Potatoes",
      "Options": [
        {"Description": "Fried Potatoes", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
        {"Description": "Fried Onions", "Image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
      ]
    }
  ];

  var firstNames = ["Ted", "John", "Macy", "Rob", "Gwen", "Fiona", "Mario", "Ben", "Kate", "Kevin", "Thomas", "Frank"];
  var lastNames = ["Tired", "Johnson", "Moore", "Rocket", "Goodman", "Farewell", "Manson", "Bentley", "Kowalski", "Schmidt", "Tucker", "Fancy"];
  var address = ["Turkey", "Japan", "Michigan", "Russia", "Greece", "France", "USA", "Germany", "Sweden", "Denmark", "Poland", "Belgium"];

  $scope.MySelectedIndex = null;
  $scope.db = {};
  $scope.db.items = [];
  for (var i = 0; i < 10000; i++) {
    $scope.db.items.push(
      {
        id: i + 1,
        name: {
          first: firstNames[Math.floor(Math.random() * firstNames.length)],
          last: lastNames[Math.floor(Math.random() * lastNames.length)]
        },
        address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
        price: Math.floor(Math.random() * 100000) / 100,
        isActive: 'Yes',
        Product: $.extend({}, products[Math.floor(Math.random() * products.length)])
      }
    );
  }

  $scope.db.dynamicColumns = [
    {value: 'item.id', title: 'ID'},
    {value: 'item.name.last', title: 'Last Name'},
    //{value: 'item.name.first', title: 'First Name'}, //this will be added dynamically after button is pressed
    {value: 'item.address', title: 'Address', width: 120},
    {value: 'item.Product.Description', type: 'autocomplete', title: 'Favorite food', width: 120, clickrow: 'item.Product.Description = option.Description', optionList: 'option in item.Product.Options', optionTemplate: '<img ng-src="{{option.Image}}" style="width: 16px; height: 16px; border-width: 0"> {{option.Description}}'},
    {value: 'item.isActive', type: 'checkbox', title: 'Is active', checkedTemplate: 'Yes', uncheckedTemplate: 'No'}
  ];

  var c = 0;
  $scope.myHeight = 320;
  setInterval(function () {
    $scope.db.dynamicColumns[0].title = 'ID (' + c + ')';
    //$scope.myHeight += 2;
    if (!$scope.$$phase) { //if digest is not in progress
      $scope.$apply();
    }
    c++;
  }, 5000);

  $scope.dumpItems = function () {
    console.log("dump items", $scope.db.items);
  };

  $scope.addColumn = function () {
    $scope.db.dynamicColumns.splice(2, 0, {value: 'item.name.first', title: 'First Name'});
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
    $scope.filteredItems = $filter('filter')($scope.db.items, $scope.query);
  });
  $scope.filteredItems = $scope.db.items;

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
    if (!$scope.$$phase) { //if digest is not in progress
      $scope.$apply(function () {
        $scope.currentSelection = str;
      });
    }
  });
}