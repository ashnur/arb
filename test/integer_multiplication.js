void function(){
  var multiply = require('../integer_multiplication.js')
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

  var one = require('../one.js')()

  function print(n, arr){
    return log(n+' '+join(arr, ', '))
  }

  function associativity(a, b, c){
    var ab = multiply(a, b)
    var bc = multiply(b, c)
    var ab_c = multiply(ab, c)
    var a_bc = multiply(a, bc)
    var r = equal(ab_c, a_bc)
    if ( ! r ) {
      print('a', a)
      print('b', b)
      print('ab', ab)
      print('c', c)
      print('ab_c', ab_c)
      print('b', b)
      print('c', c)
      print('bc', bc)
      print('a_bc', a_bc)

    }
    return r
  }

  function commutativity(a, b){
    var ab = multiply(a, b)
    var ba = multiply(b, a)
    var r = equal(ab, ba)
    if ( ! r ) {
      print('a', a)
      print('b', b)
      print('ab', ab)
      print('ba', ba)
    }
    return r
  }

  function identity(a){
    return equal(multiply(a, one), a)
  }

  function check_property(property){
    test(property.title, function(t){
      var results = check(300, property.checks)
      results.failed.forEach(function(result){
        if (result.value.stack) console.log(result.value.stack)
        t.fail('==> '+ results.passed.length+' passed, '+', 1 failed with arguments: ' + JSON.stringify(result.arguments))
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }

  ;[

  { title : 'commutativity'
    , checks: for_all(arb_int, arb_int).satisfy(commutativity)
    }
  ,
  { title : 'associativity'
    , checks: for_all(arb_int, arb_int, arb_int).satisfy(associativity)
    }
  , { title : 'identity'
    , checks: for_all(arb_int).satisfy(identity)
    }
  ].forEach(check_property)
}()
