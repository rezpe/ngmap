ngmap
=====

Angular Geographical Map

NgMap brings the power of Angular to the representation of Geographical Data.

Getting Started
--------------------

THE API IS WIP !!!!

This library provides an angular directive that displays a world map with the data in the attibutes:
* routes: array of routes with originlat, originlon, destlat, destlon, width
** Example: 
```javascript
[{olat:48.85 ,olong:2.35, dlat:40.40, dlong:-3.71,value:50},
 {olat:45.52 ,olong:-122.68, dlat:40.40, dlong:-3.71,value:50}]
```

* points: array of points with text, pointlat, pointlon
```javascript
[{name:"Paris",lat:48.85,long:2.35},
 {name:"Madrid",lat:40.40,long:-3.71},
 {name:"Portland",lat:45.52,long:-122.68},]
```
See Main.htm for the API use.

The div will take the width of the container and will set the height so it's a square.
