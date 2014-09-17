angular.module('ngHandsontableDemo',
	[
		'ngHandsontable'
	])
	.controller(
		'DemoCtrl', [
			'$scope',
			function ($scope) {

				var products = [
					{
						"description": "Big Mac",
						"options": [
							{"description": "Big Mac", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
							{"description": "Big Mac & Co", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
							{"description": "McRoyal", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
							{"description": "Hamburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
							{"description": "Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
							{"description": "Double Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
						]
					},
					{
						"description": "Fried Potatoes",
						"options": [
							{"description": "Fried Potatoes", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
							{"description": "Fried Onions", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
						]
					}
				];

				var firstNames = ["Ted", "John", "Macy", "Rob", "Gwen", "Fiona", "Mario", "Ben", "Kate", "Kevin", "Thomas", "Frank"];
				var lastNames = ["Tired", "Johnson", "Moore", "Rocket", "Goodman", "Farewell", "Manson", "Bentley", "Kowalski", "Schmidt", "Tucker", "Fancy"];
				var address = ["Turkey", "Japan", "Michigan", "Russia", "Greece", "France", "USA", "Germany", "Sweden", "Denmark", "Poland", "Belgium"];

				$scope.db = {};
				$scope.db.items = [];
				for (var i = 0; i < 10; i++) {
					$scope.db.items.push(
						{
							id: i + 1,
							name: {
								first: firstNames[Math.floor(Math.random() * firstNames.length)],
								last: lastNames[Math.floor(Math.random() * lastNames.length)]
							},
							address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
							price: Math.floor(Math.random() * 100000) / 100,
							isActive: Math.floor(Math.random() * products.length) / 2 == 0 ? 'Yes' : 'No',
							product: angular.extend({}, products[Math.floor(Math.random() * products.length)])
						}
					);
				}
			}
		]
	);