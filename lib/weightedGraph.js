var weightedGraph = function(){
  this.graph = {};
}

weightedGraph.prototype = {
  addVertex : function(vertex){
    this.graph[vertex] = this.graph[vertex] || [];
  },
  addEdge :function(edge){
    this.graph[edge.from].push(edge);
  },
  shortestPath :function(from,to,path){
    var path = path||[];
    var edges = this.graph[from];
    var requiredEdge = edges.reduce(function(prevEdge,currEdge){
      return (currEdge.weight<=prevEdge.weight)?currEdge:prevEdge;
    },edges[0]);
    path.push(requiredEdge);
    if(requiredEdge.to==to)
      return path;
    return this.shortestPath(requiredEdge.to,to,path);
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
