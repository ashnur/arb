void function(){
  var add = require('../integer_addition.js')
  var rand_int = require('./rand_int.js')
  var test = require('tape')
  var claire = require('claire')
  var for_all = claire.forAll
  var check = claire.check
  var as_generator = claire.asGenerator
  var arb_int = as_generator(rand_int.positive)
  var equal = require('../integer_equality.js')
  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var pool = require('../pool.js')
  var log = console.log.bind(console)

  var zero = require('../zero.js')()

  function print(n, arr){
    return n+' '+join(arr, ', ')
  }

  function associativity(a, b, c){
    return equal(add(a, add(b, c)), add(add(a, b), c))
  }

  function commutativity(a, b){
    return equal(add(a, b), add(b, a))
  }

  function identity(a){
    return equal(add(a, zero), a)
  }

  function check_property(property){
    test(property.title, function(t){
      var results = check(1000, property.checks)
      results.failed.forEach(function(result){
        t.fail('==> '+ results.passed.length+' passed, '+', 1 failed with arguments: ' + JSON.stringify(result.arguments))
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }
  ;[{ title : 'commutativity'
    , checks: for_all(arb_int, arb_int).satisfy(commutativity)
    }
  , { title : 'associativity'
    , checks: for_all(arb_int, arb_int, arb_int).satisfy(associativity)
    }
  , { title : 'identity'
    , checks: for_all(arb_int).satisfy(identity)
    }
  ].forEach(check_property)

}()
