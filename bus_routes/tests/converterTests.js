var graphs=require('../lib/converter');
var assert=require('chai').assert;
var ld=require('lodash');

var file = ['252H:RAJIVGANDHI NAGAR,LEGGERE,RAJAGOPALNAGAR,KANTEERAVA STUDIO,RJNR. 1ST BLK.,BHASHYAM CIRCLE,KBS,KEMPEGOWDA BUS STAND',
'252E:LEGGERE,RAJAGOPALNAGAR POL.STN,JALAHALLI CR,SURYODAYA MILLS,YESHWANTHPUR BUS STAND,MALLESWARAM 18 CR,CENTRAL TALKIES,KBS,KEMPEGOWDA BUS STAND',
'251C:LEGGERE,RAJAGOPALNAGAR,SURYODAYA MILLS,YESHWANTHPUR BUS STAND,CPRI GATE,J C NAGAR,SHIVAJINAGAR BUS STAND',
'251D:LEGGERE,RAJIVGANDHI NAGAR,RAJAGOPALNAGAR POL.STN,S M ROAD,SURYODAYA MILLS,YESHWANTHPUR BUS STAND,MALLESWARAM 8TH CR.,KBS,KEMPEGOWDA BUS STAND,K R MARKET',
'251E:LEGGERE,RAJAGOPALNAGAR POL.STN,KANTEERAVA STUDIO,RJNR. 1ST BLK.,RJNR-RAMMANDIRA,MAGADI RD LEPROSARIUM,SIRSI CIRCLE,K R MARKET']

var busExtractor = function(actual){
  var actualBuses = [];
  for(var i in actual){
    actualBuses.push(actual[i].name);
  }
  return actualBuses;
}

describe('graph',function(){
  var g = new graphs.WeightedGraph(file);

  it('should have all the buses ',function(){
    var expected = file.length;
    var actual = Object.keys(g.buses).length;
    assert.ok(expected == actual);
  });

  describe('shortest path',function(){
    it('should give the shortest path between two locations',function(){
      var expectedPath = [];
      var actualPath = g.shortestPath('LEGGERE','SHIVAJINAGAR BUS STAND');
      var actualPath = busExtractor(actualPath);
      assert.deepEqual(expectedPath,actualPath);
    });
  });

  describe('direct bus',function(){
    it('should give one direct bus if there is only one bus ',function(){
      var expectedBuses = ['251C'];
      var actual = g.directBus('LEGGERE','SHIVAJINAGAR BUS STAND');
      var actualBuses = busExtractor(actual);
      assert.deepEqual(expectedBuses,actualBuses);
    });
    it('should give all direct buses',function(){
      var expectedBuses = ['252H','252E','251D']
      var actual = g.directBus('LEGGERE','KEMPEGOWDA BUS STAND');
      var actualBuses = busExtractor(actual);
      assert.deepEqual(expectedBuses,actualBuses);
    })
  });
});
