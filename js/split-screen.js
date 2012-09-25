function MyCtrl($scope) {
  $scope.activeOptions = ['Yes', 'No'];

  $scope.items = [
    {id: 1, name: {first: "Marcin", last: "Warpechowski"}, address: "Schellingstr. 58, Muenchen", isActive: 'Yes', "Product": {
      "Description": "Big Mac",
      "Options": [
        {"Description": "Big Mac", "Image": "bigmac.png", Pick$: null},
        {"Description": "Big Mac & Co", "Image": "bigmacco.png", Pick$: null}
      ]}},
    {id: 2, name: {first: "John", last: "Irving"}, address: "Chengdu Road, Wanhua, Taipei 108", isActive: 'Yes', "Product": {
      "Description": "Fried Potatoes",
      "Options": [
        {"Description": "Fried Potatoes", "Image": "", Pick$: null},
        {"Description": "Fried Onions", "Image": "", Pick$: null}
      ]}},
    {id: 3, name: {first: "Jeremy", last: "Springsteen"}, address: "4 New York Plaza, New York, NY 10004", isActive: 'Yes', "Product": {
      "Description": "McRoyal",
      "Options": [
        {"Description": "McRoyal", "Image": "", Pick$: null},
        {"Description": "McRoyal with Cheese", "Image": "", Pick$: null}
      ]}}
  ];

  $scope.dumpItems = function () {
    console.log("dump items", $scope.items);
  }

  $scope.getOptions = function (options) {
    var out = []
    if(typeof options === 'object' && options.length) {
      for (var i = 0, ilen = options.length; i < ilen; i++) {
        out.push(options[i].Description);
      }
    }
    return out;
  }
}