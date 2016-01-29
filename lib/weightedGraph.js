var ld = require('lodash');

var weightedGraph = function(){
  this.graph = {};
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
    count++;
    path.push(parent[path[path.length-1]]);
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
  addVertex : function(vertex){
    this.graph[vertex] = this.graph[vertex] || [];
  },
  addEdge :function(edge){
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
  }
}


var graphs = {
  WeightedGraph : weightedGraph,
  Edge : function(name,from,to,weight){
    this.weight = weight;
    this.name = name;
    this.from = from;
    this.to = to;
  }
}

module.exports = graphs;
