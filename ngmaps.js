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

myApp.directive('ngmap', function() {
  return {
    template: '<div id="chart"></div>',
    scope: {
      points: "=",
      routes: "=",
      center: "=",
      scale: "="
    },
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      d3.json('data/land.topojson', function(error, data) {

        if (error) {
          return error;
        }

        var margin = 10;
        var width = parseInt(d3.select(element.children("#chart")[0]).style("width")) - margin * 2;
        var height = width;

        // Transform the TopoJSON data to GeoJSON
        var geojson = topojson.feature(data, data.objects.land);

        var svg = d3.select(element.children("#chart")[0]).append('svg').data([geojson]);

        // Create the SVG container
        svg.attr('width', width)
          .attr('height', height);

        // Create and configure the projection
        var projection = d3.geo.mercator()
          .center(scope.center)
          .scale(scope.scale)

        // Create and configure the geo path generator
        var path = d3.geo.path()
          .projection(projection);

        // Globe
        var globe = svg.append('path').datum({
            type: 'Sphere'
          })
          .attr('d', path)
          .attr('class', 'globe')
          .attr('fill', '#6D9BB9');

        var land = svg.selectAll('path.feature').data([geojson])
          .enter()
          .append('path')
          .attr('d', path)
          .attr('class', 'feature')
          .attr('fill', '#DEE1CB');

        var g = svg.append("g")

        if (scope.routes) {

          var gflight = g.append("g").attr("class", "routes");

          var length = 100
          var color = d3.scale.linear().domain([1, length]).range(['blue', 'red']);

          gflight.selectAll(".arc")
            .data(scope.routes)
            .enter()
            .append("path").attr({
              'class': 'arc'
            })
            .datum(function(d) {
              return {
                type: "LineString",
                coordinates: [
                  [d.olong, d.olat],
                  [d.dlong, d.dlat]
                ],
                value: d.value
              }
            })
            .style({
              fill: 'none',
            }).attr("d", path)
            .attr("stroke", function(d) {
              return "" + color(d.value);
            })
            .attr("stroke-width", function(d) {
              return 10 * d.value / 100;
            })
            .attr("stroke-linejoin", "round")
        }

        //points
        if (scope.points) {

          var gplaces = g.append("g").attr("class", "places");

          gplaces.selectAll(".place")
            .data(scope.points)
            .enter().append("text")
            .attr("transform", function(d) {
              var lato = d.lat;
              var lono = d.long;
              return "translate(" + projection([lono, lato]) + ")";
            })
            .text(function(d) {
              return d.name
            })
            .attr("stroke", "black")
        }


      });
    }
  };
});
