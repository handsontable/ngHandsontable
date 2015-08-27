(function() {
  var
    products = [
      {
        description: 'Big Mac',
        options: [
          {description: 'Big Mac'},
          {description: 'Big Mac & Co'},
          {description: 'McRoyal'},
          {description: 'Hamburger'},
          {description: 'Cheeseburger'},
          {description: 'Double Cheeseburger'}
        ]
      },
      {
        description: 'Fried Potatoes',
        options: [
          {description: 'Fried Potatoes'},
          {description: 'Fried Onions'}
        ]
      }
    ],
    firstNames = ['Ted', 'John', 'Macy', 'Rob', 'Gwen', 'Fiona', 'Mario', 'Ben', 'Kate', 'Kevin', 'Thomas', 'Frank'],
    lastNames = ['Tired', 'Johnson', 'Moore', 'Rocket', 'Goodman', 'Farewell', 'Manson', 'Bentley', 'Kowalski', 'Schmidt', 'Tucker', 'Fancy'],
    address = ['Turkey', 'Japan', 'Michigan', 'Russia', 'Greece', 'France', 'USA', 'Germany', 'Sweden', 'Denmark', 'Poland', 'Belgium'];

  function dataFactory() {
    return {
      generateArrayOfObjects: function(rows, keysToInclude) {
        var items = [], item;

        rows = rows || 10;

        for (var i = 0; i < rows; i++) {
          item = {
            id: i + 1,
            name: {
              first: firstNames[Math.floor(Math.random() * firstNames.length)],
              last: lastNames[Math.floor(Math.random() * lastNames.length)]
            },
            date: Math.max(Math.round(Math.random() * 12), 1) + '/' + Math.max(Math.round(Math.random() * 28), 1) + '/' + (Math.round(Math.random() * 80) + 1940),
            address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
            price: Math.floor(Math.random() * 100000) / 100,
            isActive: Math.floor(Math.random() * products.length) / 2 === 0 ? 'Yes' : 'No',
            product: angular.extend({}, products[Math.floor(Math.random() * products.length)])
          };
          angular.forEach(keysToInclude, function(key) {
            if (item[key]) {
              delete item[key];
            }
          });
          items.push(item);
        }

        return items;
      },

      generateArrayOfArrays: function(rows, cols) {
          return Handsontable.helper.createSpreadsheetData(rows || 10, cols || 10);
      }
    };
  }
  dataFactory.$inject = [];

  angular.module('ngHandsontable').service('dataFactory', dataFactory);
}());
