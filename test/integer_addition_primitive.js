void function(){
  var add = require('../integer_addition.js')
  var addp = require('../integer_add_primitive.js')
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
  var rn = require('random-number')
  var zero = require('../zero.js')
  var rn_opts = {min:0, max: Math.pow(2,53), integer: true}
  var by_opts = {min:0, max: 100, integer: true}
  var arb_primitive = as_generator(function(){ return rn(rn_opts) })
  var bygen = as_generator(function(){ return rn(by_opts) })
  var to_int = require('../primitive_to_int.js')

  function print(n, arr){
    return log(n, join(arr, ', '))
  }

  var left_pad = require('../left_pad.js')

  function associativity(a, b, c){
    var bc = addp(b, c, 0)
    var a_bc = add(a, bc)
    var ab = add(a, b)
    var ab_c = addp(ab, c, 0)
    var r = equal(a_bc, ab_c)
    if ( ! r ) {
      print('b', b)
      log('c', c)
      print('bc', bc)
      print('a', a)
      print('a_bc', a_bc)
      print('a', a)
      print('b', b)
      print('ab', ab)
      log('c', c)
      print('ab_c', ab_c)
    }
    return  r
  }

  function shift(A, P, by){
    var B = left_pad(to_int(P), by)
    var n = add(A, B)
    var m = addp(A, P, by)
    var r = equal(n, m)
    if ( ! r ) {
      log('by', by)
      print('A', A)
      log('P', P)
      print('B', B)
      print('n', n)
      print('m', m)
    }
    return r
  }

  function check_property(property){
    test(property.title, function(t){
      var results = check(2000, property.checks)
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
  ;[{ title : 'associativity'
    , checks: for_all(arb_int, as_generator(zero), arb_primitive).satisfy(associativity)
    }
  , { title : 'shift'
    , checks: for_all(arb_int,  arb_primitive, bygen).satisfy(shift)
    }
  ].forEach(check_property)

}()
