var fs = require('fs');
// var file = require('./raw_routes');
var ld = require('lodash');


var weightedGraph = function(file){
  this.graph = {};
  this.buses = {};
  for(var i in file){
    var name = file[i].split(':');
    var busName = name[0];
    var route = name[1].split(',');
    this.buses[busName] = route;
  }
  var keys = Object.keys(this.buses);
  this.createStops();
  this.createEdge();
}

var Graph = {
  WeightedGraph : weightedGraph,
  Edge : function(name,from,to,weight){
    this.name = name;
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

var convertVertexTOEdges= function(vertices,graph){
  var result = []
  vertices.map(function(vertex,i){
    var edges = graph[vertex];
    var index = ld.findIndex(edges,{from:vertex,to:vertices[i+1]});
    if(index>=0){
      result.push(edges[index]);
    }
  })
  return result;
}

var findPath = function(from,to,parent){
  var path = [to];
  var max = Object.keys(parent).length;
  var count = 0;
  while(count!=max){
    path.push(parent[path[path.length-1]]);
    count++;
  }
  path = path.reverse();
  return path;
}

var newObject = function(vertices,value){
  var result = {};
  for(var i = 0; i<vertices.length; i++){
    result[vertices[i]] = value;
  }
  return result;
}



weightedGraph.prototype = {
  addEdge: function(edge){
    this.graph[edge.from].push(edge);
  },
  shortestPath :function(from,to,path){
    var graph = this.graph;
    var vertices = Object.keys(this.graph);
    var distance = newObject(vertices,Infinity);
    var parent = newObject(vertices,null);
    distance[from] = 0;
    parent[from] = from ;
    while(vertices.length>0){
      var shortDistencedVertex = vertices.reduce(function(v1,v2){
        return (distance[v1]<=distance[v2])?v1:v2;
      });
      var shortDistencedEdges = graph[shortDistencedVertex];
      shortDistencedEdges.forEach(function(e1){
        var fromDistance = distance[e1.from];
        var newDistance = e1.weight+fromDistance;
        if(newDistance<distance[e1.to]){
          distance[e1.to] = newDistance;
          parent[e1.to] = e1.from;
        }
      })
      vertices.splice(vertices.indexOf(from),1);
    }
    var path = findPath(from,to,parent);
    return convertVertexTOEdges(path,graph);
  },
  BusesFromPlace:function(location){
    var x = [];
    var hub = this.graph[location];
    for(var i in hub)
      x.push(hub[i].name);
    return x;
  },
  findHubs:function(){
    var g = this.graph;
    var locations = Object.keys(g);
    var x = locations.filter(function(loc){
      if(g[loc].length > 80)
        return loc;
    })
    return x;
  },
  createStops:function(){
    var graph = this.graph;
    var buses = this.buses;
    var busNum = Object.keys(buses);
    for(var i in busNum){
      var route = buses[busNum[i]];
      for(var j in route){
        var keys = Object.keys(graph);
        if(keys.indexOf(route[j])<0)
          graph[route[j]] = [];
      }
    }
  },
  createEdge :function(buses,g){
    var g = this.graph;
    var buses = this.buses;
    var keys = Object.keys(buses);
    for(var i in keys){
      var bus = buses[keys[i]];
      for(var j=0;j<bus.length-1;j++){
        var edge = new Graph.Edge(keys[i],bus[j],bus[j+1],1);
        this.addEdge(edge);
      }
    }
  },
  directBus:function(from,to){
    var direct = [];
    var buses = this.buses;
    var keys = Object.keys(buses);
    for(var i in keys){
      var route = buses[keys[i]];
      for(var j in route ){
        for(var k=route.length;k>0;k--){
          if(route[j]==from && route[k]==to){
            var edge = new Graph.Edge(keys[i],route[0],route[route.length-1],1);
            edge.startingPlace = route[j];
            edge.endingPlace = route[k];
            direct.push(edge);
          }
        }
      }
    }
    return direct;
  }

}

module.exports = Graph;
