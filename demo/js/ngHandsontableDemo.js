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

			}
		]
	);