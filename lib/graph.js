var addVertex = function(vertex){
  this.graph[vertex] = this.graph[vertex] || [];
};

var hasEdgeBetween=function(from,to){
  return (this.graph[from].indexOf(to)>=0);
};

var order = function(){
  return  (Object.keys(this.graph)).length;
};

var size = function(graph){
  var keys = Object.keys(graph);
  return keys.reduce(function(prevValue,key){
    return prevValue+graph[key].length;
  },0)
}

var pathBetween = function(from,to,vertices){
  var vertices = vertices || [];
  if(from == to)
    return vertices.concat(from);
  var edges = this.graph[from];
  for(var i in edges){
    if(vertices.indexOf(edges[i])<0){
      var result = this.pathBetween(edges[i],to,vertices.concat(from));
      if(result[result.length-1]==to)
        return result;
    }
  }
  return vertices;
}

var farthestVertex = function(vertex){
  // var adjacents = this.graph[vertex];
  // console.log(adjacents);
  // for(var i in adjacents){
  //   var newAdj = this.graph[adjacents[i]];
  //   console.log(adjacents[i],newAdj);
  //   if(newAdj.indexOf(vertex)>=0 || newAdj.length == 0)
  //     return adjacents[i];
  // }
  //==========================================================
  // console.log("farthestVertex");
  var paths = [];
  var adjacents = this.graph[vertex];
  var keys = Object.keys(this.graph);
  for(var i in keys){
    var path = this.pathBetween(vertex,keys[i]);
    paths.push(path);
  }
  var result = paths.reduce(function(prevPath,currentPath){
    var prevPathLength  = prevPath.length;
    var currentPathLength = currentPath.length;
    return (prevPathLength > currentPathLength)?prevPath:currentPath;
  },[]);
  // console.log("farthestVertex");
  return result[result.length-1];
}

var allPaths = function(from,to,vertices,paths){
  var paths = paths || [];
  var vertices = vertices || [];
  if(from == to)
    return vertices.concat(from);
  var edges = this.graph[from];
  for(var i in edges){
    if(vertices.indexOf(edges[i])<0){
      var result = this.allPaths(edges[i],to,vertices.concat(from),paths);
      if(result[result.length-1]==to)
        paths.push(result);
    }
  }
  return paths;
}

//==============================================================================

var DirectedGraph = function(){
  this.graph = {};
}

DirectedGraph.prototype = {
  addVertex:addVertex,
  addEdge:function(from,to){
    this.graph[from].push(to);
  },
  hasEdgeBetween:hasEdgeBetween,
  order:order,
  size:function(){
    return size(this.graph);
  },
  pathBetween:pathBetween,
  farthestVertex:farthestVertex,
  allPaths:allPaths
}

var UndirectedGraph = function(){
  this.graph = {};
}

UndirectedGraph.prototype = {
  addVertex:addVertex,
  addEdge:function(from,to){
    this.graph[from].push(to);
    this.graph[to].push(from);
  },
  hasEdgeBetween:hasEdgeBetween,
  order:order,
  size:function(){
    return size(this.graph)/2;
  },
  pathBetween:pathBetween,
  farthestVertex:farthestVertex,
  allPaths:allPaths
}

var graphs = {
  DirectedGraph : DirectedGraph,
  UndirectedGraph : UndirectedGraph,
}

module.exports = graphs;
