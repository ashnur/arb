void function(){
  "use strict"

  var test = require('tape')
  var claire = require('claire')
  var for_all = claire.forAll
  var check = claire.check

  function value(size, gen){ return claire.value(size, gen, gen) }

  function check_property(count, property){
    test(property.title, function(t){
      var checks = for_all.apply(null, property.args)
                        .satisfy(property.fn)
                        .classify(property.analyze)
      var results = check(count, checks)
      results.failed.forEach(function(result){
        t.fail('')
      })
      if ( results.failed.length == 0 ) {
        t.pass('all test passed')
      }
      console.log(results+'')
      t.end()
    })
  }

  module.exports = function(count, properties){
    return properties.forEach(function(prop, idx, properties){
      return check_property(count || 100, prop)
    })
  }

  module.exports.value = value

}()

