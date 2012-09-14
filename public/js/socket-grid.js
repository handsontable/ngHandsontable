function MyCtrl($scope) {
  var socket = io.connect('http://localhost');

  $scope.items = [
    ["", "Kia", "Nissan", "Toyota", "Honda"],
    ["2008", 10, 11, 12, 13],
    ["2009", 20, 11, 14, 13],
    ["2010", 30, 15, 12, 13]
  ];

  $scope.dumpItems = function () {
    console.log("dumpItems", $scope.items);
  }

  $scope.$watch('items', function (newVal, oldVal) {
    console.log('emiting items', newVal);
    //$scope.filteredItems = $filter('filter')($scope.items, $scope.query);
    //socket.emit('items', newVal);
  });

  $scope.$on('broadcastItems', function () {
    console.log('broadcasting items');
    socket.emit('items', $scope.items);
  });

  socket.on('items', function (data) {
    console.log("received items", data);
    $scope.items = data;
    $scope.$emit('incomingItems');
  });
}