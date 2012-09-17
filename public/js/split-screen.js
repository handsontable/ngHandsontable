function MyCtrl($scope) {
  $scope.items = [
    {id: 9, hidden: "ddd", name: "Marcin", address: "Schellingstr. 58, Muenchen"},
    {id: 9, hidden: "ddd", name: "Marcin", address: "Schellingstr. 58, Muenchen"},
    {id: 9, hidden: "ddd", name: "Marcin", address: "Schellingstr. 58, Muenchen"}
  ];

  $scope.dumpItems = function () {
    console.log("dump items", $scope.items);
  }
}