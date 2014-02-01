void function(){
  'use strict'
  var test = require('tape')
  var pool = require('../pool.js')
  var equal = require('../integer_equality.js')
  var rand_int = require('./rand_int.js')
  var integer = require('../integer.js')
  var add = integer.add
  var subtract = integer.subtract
  var multiply = integer.multiply
  var divide = integer.divide
  var claire = require('claire')
  var for_all = claire.forAll
  var check = claire.check
  var as_generator = claire.asGenerator
  var Integer = as_generator(function(size){ return rand_int() })
  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var log = console.log.bind(console)

  var zero = require('../zero.js')()
  var one = require('../one.js')()

  function print(n, arr){ return log(n, arr+'') }

  function subtract_sum(n, m, k){
    var mk = add(m, k)
    var n_mk = subtract(n, mk)
    var n_m = subtract(n, m)
    var n_m_k = subtract(n_m, k)
    var r = equal(n_mk, n_m_k)
    if ( ! r ) {
      log('n-(m+k) == n - m - k')
      print('n', n)
      print('m', m)
      print('k', k)
      print('m+k', mk)
      print('n-m', n_m)
      print('n-m-k', n_m_k)
      print('n-(m+k)', n_mk)
    }
    return r
  }

  function add_difference(n, m, k){
    var x = subtract(m, k)
    var a = add(n, x)
    var y = add(n, m)
    var b = subtract(y, k)
    var r = equal(a, b)
    return r
  }

  function subtract_difference(n, m, k){
    var a = subtract(n, subtract(m, k))
    var b = add(subtract(n, m), k)
    return equal(add(a, b), add(b, a))
  }

  function associativity_add(a, b, c){
    return equal(add(a, add(b, c)), add(add(a, b), c))
  }

  function commutativity_add(a, b){
    return equal(add(a, b), add(b, a))
  }

  function identity(a){
    return (equal(add(a, zero), a)
          && equal(add(zero, a), a)
          && equal(subtract(a, zero), a)
          && equal(multiply(a, one), a)
          )
  }

  function associativity_mul(a, b, c){
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

  function commutativity_mul(a, b){
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



  function check_property(property){
    test(property.title, function(t){
      var results = check(1000, property.checks)
      results.failed.forEach(function(result){
        console.log(results+'')
        t.fail()
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }

  ;[
    // this should really be prepended somehow for all tests
    { title: 'not all the same'
      , checks: for_all( claire.data.Array(Integer) )
         .given(function(xs){
           return xs.length > 10
         })
         .satisfy(function(xs){
           var r  = xs.reduce(function(filtered, next){
              if ( filtered.every(function(i){
                return ! equal ( next, i )
              }) )  {
                filtered.push(next)
              }
             return filtered
           }, []).length
           if ( r <= 1 ) log( xs)
           return  r > 1
         })
    }
  , { title : 'identity'
    , checks: for_all(Integer).satisfy(identity)
    }
  ,
    { title : 'additive commutativity'
    , checks: for_all(Integer, Integer).satisfy(commutativity_add)
    }
  ,
    { title : 'additive associativity'
    , checks: for_all(Integer, Integer, Integer).satisfy(associativity_add)
    }
  , { title : 'subtract_sum'
    , checks: for_all(Integer, Integer, Integer).satisfy(subtract_sum)
    }
  , { title : 'add_difference'
    , checks: for_all(Integer, Integer, Integer).satisfy(add_difference)
    }
  , { title : 'subtract_difference'
    , checks: for_all(Integer, Integer, Integer).satisfy(subtract_difference)
    }
  , { title : 'multiplicative commutativity'
    , checks: for_all(Integer, Integer).satisfy(commutativity_mul)
    }
  , { title : 'multiplicative associativity'
    , checks: for_all(Integer, Integer, Integer).satisfy(associativity_mul)
    }
  ].forEach(check_property)
}()
