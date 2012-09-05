function MyCtrl($scope) {
  $scope.items = [
    ["", "Kia", "Nissan", "Toyota", "Honda"],
    ["2008", 10, 11, 12, 13],
    ["2009", 20, 11, 14, 13],
    ["2010", 30, 15, 12, 13]
  ];

  $scope.dumpItems = function() {
    console.log("dumpItems", $scope.items);
  }

  $scope.$watch('items', function (newVal, oldVal) {
    //$scope.filteredItems = $filter('filter')($scope.items, $scope.query);
    socket.emit('items', newVal);
  });
}