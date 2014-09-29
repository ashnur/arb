module.exports = run
module.exports.value = value

var test = require('tape')
var claire = require('claire')
var for_all = claire.forAll
var check = claire.check

var memory = require('../../memory.js')
var debug = require('../../debug.js')

//claire.Report.toString = function(){
//  return ''
//  //return this.all.map(function(a){
//  //  console.log(a.labels)
//  //  console.log(a.arguments)
//  //})
//}

function value(size, gen){ return claire.value(size, gen, gen) }

function check_property(count, property){
  test(property.title, function(t){
    var checks = for_all.apply(null, property.args)
                      .satisfy(property.fn)

    if ( property.analyze ) {
      checks = checks.classify(property.analyze)
    }


    var results = check(count, checks)

    if ( results.failed.length == 0 ) {
      t.pass(' test passed')
    } else {
      t.fail('')
    }

//    debug.endsize( memory.naives.ads.length,memory.naives.data.length, memory.stacks.ads.length, memory.stacks.data.length)
    property.end()
    t.end()
  })
}

function run(count, properties){
  return properties.map(function(prop, idx, properties){
    return check_property(count || 100, prop)
  })
}
