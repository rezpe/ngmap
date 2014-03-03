//Author: Sebastien Perez Vasseur

//Provider style, full blown, configurable version
var myApp = angular.module('ngMaps', []);

myApp.provider('projection', function() {

	this.projection = 'Mercator';
	this.width = "500";
	this.height = "500";

	this.$get = function() {
		var mapWidth = this.width;
		var mapHeight = this.height;
		return {
			project : function(coordinates) {

				latitude = coordinates[1];
				longitude = coordinates[0];

				// Get x value
				x = (longitude + 180) * (mapWidth / 360);

				// convert from degrees to radians
				latRad = latitude * Math.PI / 180;

				// Get y value
				mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
				y = (mapHeight / 2) - (mapHeight * mercN / (2 * Math.PI));

				return [x, y];
			}
		};
	};

	this.setDimension = function(dimension) {
		this.width = dimension.width;
		this.height = dimension.height;
	};
});

