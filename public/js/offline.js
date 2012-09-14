function MyCtrl($scope) {
  $scope.items = [
    {id: 9, name: "Marcin", address: "Schellingstr. 58, Muenchen"},
    {id: 9, name: "Marcin", address: "Schellingstr. 58, Muenchen"},
    {id: 9, name: "Marcin", address: "Schellingstr. 58, Muenchen"}
  ];

  /*$scope.dumpItems = function () {
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
  });*/
}