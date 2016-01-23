var graphs=require('../lib/graph');
var assert=require('chai').assert;
var ld=require('lodash');

var denseGraph=function() {
	var g=new graphs.DirectedGraph();
	var vertices=['A','B','C','D','E','F','G','H','I','J'];

	vertices.forEach(function(vertex){
		g.addVertex(vertex);
	});

	for (var i = 0; i < vertices.length-1; i++) {
		var from=vertices[i];
		for (var j = i+1; j < vertices.length; j++) {
			g.addEdge(from,vertices[j]);
			g.addEdge(vertices[j],from);
		}
	}
	return g;
}

describe("add Edges",function(){
	it("should be able to determine if an edge is present",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		g.addEdge('A','B');
		assert.ok(g.hasEdgeBetween('A','B'));
		assert.notOk(g.hasEdgeBetween('B','A'));
	});
	it("should be able to determine an edge against a self loop",function(){
		var g=new graphs.UndirectedGraph();
		g.addVertex('A');
		g.addEdge('A','A');
		assert.ok(g.hasEdgeBetween('A','A'));
	});
});

describe("quantities",function(){
	it("should provide the order of a graph with a single vertex",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		assert.equal(1,g.order());
	});
	it("should provide the order of a graph with multiple vertices",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		assert.equal(2,g.order());
	});
	it("should provide the order of an empty graph",function(){
		var g=new graphs.DirectedGraph();
		assert.equal(0,g.order());
	});
	it("should provide the size of a graph with a single edge",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		g.addEdge('A','B');

		assert.equal(1,g.size());
	});
	it("should provide the size of a graph with multiple edges",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		g.addVertex('C');
		g.addEdge('A','B');
		g.addEdge('B','C');

		assert.equal(2,g.size());
	});
	it("should provide the size of a graph with no edges",function(){
		var g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');

		assert.equal(0,g.size());
	});
});

describe("paths",function(){
	var g;
	beforeEach(function(){
		g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		g.addVertex('C');
		g.addVertex('D');
		g.addVertex('E');
		g.addVertex('F');
		g.addVertex('G');
	});

	it("should determine a path between two adjacent vertices",function(){
		g.addEdge('A','B');

		var path=g.pathBetween('A','B')

		assert.deepEqual(['A','B'],path);
		assert.deepEqual([],g.pathBetween('B','A'));
	});

	it("should determine a path but ignore self loops",function(){
		g.addEdge('A','B');

		var path=g.pathBetween('A','A')

		assert.deepEqual(['A'],path);
	});

	it("should determine a path between non-adjacent vertices",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		var path=g.pathBetween('A','C')

		assert.deepEqual(['A','B','C'],path);
	});

	it("should determine a path between vertices when there is only a single path",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		g.addEdge('B','D');
		g.addEdge('D','E');

		var path=g.pathBetween('A','E')

		assert.equal(4,path.length);
		assert.deepEqual(['A','B','D','E'],path);
	});

	it("should determine a path between vertices regardless of order of edge insertion",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		g.addEdge('C','B');
		g.addEdge('B','D');
		g.addEdge('D','E');

		var path=g.pathBetween('C','E')

		assert.deepEqual(['C','B','D','E'],path);
	});

	it("should determine an empty path where vertices don't exist",function(){
		g.addEdge('A','B');

		var path=g.pathBetween('C','E');

		assert.deepEqual([],path);
	});

	it("should determine an empty path where no path exists",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		g.addEdge('C','B');

		var path=g.pathBetween('C','A');

		assert.deepEqual([],path);
	});

	it("should determine a path between two vertices where more than one path exists",function(){
		g.addEdge('A','C');
		g.addEdge('A','B');
		g.addEdge('C','D');
		g.addEdge('B','D');
		g.addEdge('D','E');

		var path=g.pathBetween('A','E')

		try {
			assert.deepEqual(['A','B','D','E'],path);
		} catch (e) {
			assert.deepEqual(['A','C','D','E'],path);
		}
	});

	it("should determine the farthest vertex from a given vertex for a simple graph",function(){
		g.addEdge('A','B');

		assert.equal('B',g.farthestVertex('A'));
	});

	it("should determine the farthest vertex from a given vertex for a simple graph with two edges",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		assert.equal('C',g.farthestVertex('A'));
	});

	it("should determine the farthest vertex from a given vertex with outdegree > 1",function(){
		g.addEdge('A','B');
		g.addEdge('A','D');
		g.addEdge('B','C');
		assert.equal('C',g.farthestVertex('A'));
	});

	it("should determine the farthest vertex from a given vertex with many vertices having outdegree > 1",function(){
		g.addEdge('A','B');
		g.addEdge('A','D');
		g.addEdge('E','D');
		g.addEdge('D','A');
		g.addEdge('B','C');
		g.addEdge('C','F');
		g.addEdge('F','G');

		assert.equal('G',g.farthestVertex('A'));
		assert.equal('G',g.farthestVertex('E'));
	});
});

describe("multiple paths",function(){
	var g;
	beforeEach(function(){
		g=new graphs.DirectedGraph();
		g.addVertex('A');
		g.addVertex('B');
		g.addVertex('C');
		g.addVertex('D');
		g.addVertex('E');
	});

	it("should determine all paths between two nodes",function(){
		g.addEdge('A','B');
		g.addEdge('B','D');
		g.addEdge('A','C');
		g.addEdge('C','D');

		var paths=g.allPaths('A','D');
		assert.equal(2,paths.length);
		var pathContained=paths.every(function(path){
			return ld.isEqual(path,['A','B','D']) || ld.isEqual(path,['A','C','D']);
		});
		assert.ok(pathContained);
	});

	it("should determine all paths between two nodes when paths are of unequal length",function(){
		g.addEdge('A','B');
		g.addEdge('B','C');
		g.addEdge('B','D');
		g.addEdge('D','C');

		var paths=g.allPaths('A','C');
		assert.equal(2,paths.length);
		var pathContained=paths.every(function(path){
			return ld.isEqual(path,['A','B','C']) || ld.isEqual(path,['A','B','D','C']);
		});
		assert.ok(pathContained);
	});
	it("should determine all paths between two vertices in a dense graph",function(){
		var dense=denseGraph();
		var paths=dense.allPaths('A','B');
		assert.equal(109601,paths.length);
	});
});
