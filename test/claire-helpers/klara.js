module.exports = run
module.exports.value = value

var test = require('tape')
var claire = require('claire')
var for_all = claire.forAll
var check = claire.check
var memory = require('../../memory.js')
var bb = require('bluebird')
bb.onPossiblyUnhandledRejection(function(){  })

function value(size, gen){ return claire.value(size, gen, gen) }

function check_property(count, property){
  var resolver = bb.pending()
  test(property.title, function(t){
    var checks = for_all.apply(null, property.args)
                      .satisfy(property.fn)

    if ( property.analyze ) {
      checks = checks.classify(property.analyze)
    }

    var results = check(count, checks)
    results.failed.forEach(function(result){
      resolver.reject(result)
      t.fail('')
    })

    if ( results.failed.length == 0 ) {
      resolver.resolve()
      t.pass('all test passed')
    }

    console.log(results+'')// , findlast(memory.stacks.data), findlast(memory.stacks.ads))
    endsize()
    property.end()
    t.end()
  })
  return resolver.promise
}

function run(count, properties){
  return properties.map(function(prop, idx, properties){
    return check_property(count || 100, prop)
  })
}
function endsize(){console.log('end size', memory.naives.data.length, memory.naives.ads.length, memory.stacks.data.length, memory.stacks.ads.length)}
function findlast(ta){
  var last = 0
  for ( var i = 0; i < ta.length; i++ ) {
    if ( ta[i] > 0 ) last = i
  }
  return last
}
