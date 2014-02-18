void function(){
  var mul= require('../integer_multiplication.js')
  var mulp = require('../integer_multiply_primitive.js')
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
  var rn = require('random-number')
  var zero = require('../zero.js')()
  var rn_opts = {min:0, max: Math.pow(2,51), integer: true}
  var arb_primitive = as_generator(function(){ return rn(rn_opts) })

  function print(n, arr){
    return log(n+' '+join(arr, ', '))
  }

  function associativity(a, b, c){
    var bc = mulp(b, c)
    var a_bc = mul(a, bc)
    var ab = mul(a, b)
    var ab_c = mulp(ab, c)
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

  function check_property(property){
    test(property.title, function(t){
      var results = check(300, property.checks)
      results.failed.forEach(function(result){
        console.log(results+'')
        t.fail('==> '+ results.passed.length+' passed, '+', 1 failed with arguments: ' + JSON.stringify(result.arguments))
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }

  ;[
    { title : 'associativity'
    , checks: for_all(arb_int, arb_int, arb_primitive).satisfy(associativity)
    }
  ].forEach(check_property)
}()
