void function(){
  'use strict'
  var equal = require('../integer_equality.js')
  var rand_int = require('./helpers/rand_int.js')
  var integer = require('../integer.js')
  var add = integer.add
  var subtract = integer.subtract
  var multiply = integer.multiply
  var divide = integer.divide
  var compare = integer.compare
  var claire = require('claire')
  var as_generator = claire.asGenerator
  var Integer = as_generator(rand_int.static_generator([0,30], 'complex', 'positive'))
  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var log = console.log.bind(console)
  var analyzer = require('./claire-helpers/analyzer.js')
  var klara = require('./claire-helpers/klara.js')

  var zero = require('../zero.js')
  var one = require('../one.js')

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

  function back_substitution_div(dividend, divisor){
    if ( ! equal(divisor, zero) ) {
      var result = divide(dividend, divisor)
      var quotient = result[0]
      var remainder = result[1]
      if ( compare(dividend, divisor) >= 0 ) {
        var r = add(multiply(quotient, divisor), remainder)
        return equal(dividend, r)
      } else {
        return equal(quotient, zero) && equal(dividend, remainder)
      }
    } else {
      try {
        divide(dividend, divisor)
      } catch (e) {
        return e.message == 'can\'t divide with zero'
      }
    }
    return false
  }

  var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

  //  , checks: for_all( claire.data.Array(Integer) )
  //     .given(function(xs){
  //       return xs.length > 10
  //     })
  //     .satisfy(function(xs){
  //       var r  = xs.reduce(function(filtered, next){
  //          if ( filtered.every(function(i){
  //            return ! equal ( next, i )
  //          }) )  {
  //            filtered.push(next)
  //          }
  //         return filtered
  //       }, []).length
  //       if ( r <= 1 ) log( xs)
  //       return  r > 1
  //     })


  var props = [
    // this should really be prepended somehow for all tests
    // { title: 'not all the same'
    // , fn: variety
    // , args: [claire.data.Array(Integer)
    // }
  , { title : 'identity'
    , fn: identity
    , args: [Integer]
    , analyze: analyzer(bigint_analyzer)
    }
  ,
    { title : 'additive commutativity'
    , fn: commutativity_add
    , args: [Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer)
    }
  ,
    { title : 'additive associativity'
    , fn: associativity_add
    , args: [Integer, Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  , { title : 'subtract_sum'
    , fn: subtract_sum
    , args: [Integer, Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  , { title : 'add_difference'
    , fn: add_difference
    , args: [Integer, Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  , { title : 'subtract_difference'
    , fn: subtract_difference
    , args: [Integer, Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  , { title : 'multiplicative commutativity'
    , fn: commutativity_mul
    , args: [Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer)
    }
  , { title : 'multiplicative associativity'
    , fn: associativity_mul
    , args: [Integer, Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  , { title : 'division back substitution'
    , fn: back_substitution_div
    , args: [Integer, Integer]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer)
    }
  ]

  klara(1000, props)
}()
