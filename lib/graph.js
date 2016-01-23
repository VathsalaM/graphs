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
  if(vertices.indexOf(from)>=0)
    return vertices;
  if(from==to)
    return vertices.concat(to);
  var adjacents = this.graph[from];
  for(var index in adjacents){
    var vertex = this.graph[from][index];
    if(vertices.indexOf(from)<0)
      vertices.push(from);
    var result = this.pathBetween(vertex,to,vertices);
    if(index==adjacents.length-1){
        vertices.pop();
      return result;
    }
    if(result[result.length-1]==to)
      return result;
  }
  return [];
}

var farthestVertex = function(vertex,prevCount,currentCount,vertices){
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
  return result[result.length-1];
}

//==============================================================================

var DirectedGraph = function(){
  this.graph = {};
}

DirectedGraph.prototype = {
  addVertex:addVertex,
  addEdge:function(from,to){
    this.graph[from] = this.graph[from]||[];
    this.graph[from].push(to);
  },
  hasEdgeBetween:hasEdgeBetween,
  order:order,
  size:function(){
    return size(this.graph);
  },
  pathBetween:pathBetween,
  farthestVertex:farthestVertex
}

var UndirectedGraph = function(){
  this.graph = {};
}

UndirectedGraph.prototype = {
  addVertex:addVertex,
  addEdge:function(from,to){
    this.graph[from] = this.graph[from]||[];
    this.graph[to] = this.graph[to]||[];
    this.graph[from].push(to);
    this.graph[to].push(from);
  },
  hasEdgeBetween:hasEdgeBetween,
  order:order,
  size:function(){
    return size(this.graph)/2;
  },
  pathBetween:pathBetween,
  farthestVertex:farthestVertex
}

var graphs = {
  DirectedGraph : DirectedGraph,
  UndirectedGraph : UndirectedGraph
}

module.exports = graphs;
