function MyCtrl($scope) {
  $scope.items = [
    {id: 1, name: {first: "Marcin", last: "Warpechowski"}, address: "Schellingstr. 58, Muenchen"},
    {id: 2, name: {first: "John", last: "Irving"}, address: "Chengdu Road, Wanhua, Taipei 108"},
    {id: 3, name: {first: "Jeremy", last: "Springsteen"}, address: "4 New York Plaza, New York, NY 10004"}
  ];

  $scope.dumpItems = function () {
    console.log("dump items", $scope.items);
  }
}