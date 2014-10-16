/*jshint asi:true, laxcomma:false*/
var console_log = console.log.bind(console)

var integer = require('../integer.js')
var memory = integer.memory

var add = integer.add
var subtract = integer.subtract
var multiply = integer.multiply
var divide = integer.divide
var compare_abs = integer.compare_abs
var equal = integer.equal

var claire = require('claire')
var as_generator = claire.asGenerator
var rand_int = require('./helpers/rand_int.js')
var get_random_bigint = rand_int.static_generator([0,10], 'simple', 'negative')
//var get_random_bigint = rand_int.static_generator([0,3], 'simple', 'negative')
var Integer = as_generator(get_random_bigint)
var liberate = require('liberate')
var join = liberate(Array.prototype.join)
var analyzer = require('./claire-helpers/analyzer.js')
var klara = require('./claire-helpers/klara.js')

var zero = integer.zero
var one = integer.one

var clone = integer.clone
var print = integer.print

var debug = require('../debug.js')

function subtract_sum(n, m, k){
  // save state adr heap
  ///var pre = {a: debug.dump(memory.adrs()), h: debug.dump(memory.heap()) }
  var n_m = subtract(n, m)
  var n_m_k = subtract(n_m, k)
  var mk = add(m, k)
  var n_mk = subtract(n, mk)
  var r = equal(n_mk, n_m_k)
  if ( ! r ) {
    // show saved state and current state
    //console_log('pre adrs: ', pre.a)
    //console_log('cur adrs: ', debug.dump(memory.adrs()))
    //console_log('pre heap: ', pre.h)
    //console_log('cur heap: ', debug.dump(memory.heap()))
    console_log('n-(m+k) == n - m - k')
    print('n', n)
    print('m', m)
    print('k', k)
    print('m+k', mk)
    print('n-m', n_m)
    print('n-(m+k)', n_mk)
    print('n-m-k', n_m_k)
  }
  return r
}

function add_difference(n, m, k){
  var mk = subtract(m, k)
  var n_mk = add(n, mk)
  var nm = add(n, m)
  var nm_k = subtract(nm, k)
  var r = equal(n_mk, nm_k)
  if ( ! r ) {
    print('n', n)
    print('m', m)
    print('k', k)
    print('m-k', mk)
    print('n+m', nm)
    print('n+(m-k)', n_mk)
    print('n+m-k', nm_k)
  }
  return r
}

function subtract_difference(n, m, k){
  var a = subtract(n, subtract(m, k))
  var b = add(subtract(n, m), k)
  return equal(add(a, b), add(b, a))
}

function associativity_add(a, b, c){
var ab = add(a, b)
var bc = add(b, c)
var ab_c = add(ab, c)
var a_bc = add(a, bc)
var r = equal(a_bc, ab_c)
if ( !r ) {
  print('a', a)
  print('b', b)
  print('c', c)
  print('bc', bc)
  print('ab', ab)
  print('a_bc', a_bc)
  print('ab_c', ab_c)
}
  return r
}

function commutativity_add(a, b){
  return equal(add(a, b), add(b, a))
}

function identity(a){
  if ( !equal(add(a, zero), a) ) {
    throw new Error('a + 0')
  }
  if ( !equal(add(zero, a), a) ) {
    throw new Error('0 + a')
  }
  if ( !equal(subtract(a, zero), a) ) {
    throw new Error('a - 0')
  }
  var z = multiply(a, one)
  if ( !equal(z, a) ) {
    print('a', a)
    print('one', one)
    print('a', a)
    print('z', z)
    throw new Error('0 - a')
  }
  return true
}

function associativity_mul(a, b, c){
  var ab = multiply(a, b)
  var bc = multiply(b, c)
  var ab_c = multiply(ab, c)
  var a_bc = multiply(a, bc)
  var r = equal(ab_c, a_bc)
  if ( ! r ) {
    print('a', a)
    console.log('a', topolynom(a))
    print('b', b)
    console.log('b', topolynom(b))
    print('ab', ab)
    console.log('ab', topolynom(ab))
    print('c', c)
    console.log('c', topolynom(c))
    print('ab_c', ab_c)
    console.log('ab_c', topolynom(ab_c))
    print('bc', bc)
    console.log('bc', topolynom(bc))
    print('a_bc', a_bc)
    console.log('a_bc', topolynom(a_bc))

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
  if ( !equal(divisor, zero) ) {
    var result = divide(dividend, divisor)
    var quotient = result[0]
    var remainder = result[1]
    if ( compare_abs(dividend, divisor) >= 0 ) {
      var r1 = multiply(quotient, divisor)
      var r2 = add(r1, remainder)
      var z = equal(dividend, r2)
      if ( !z ) {
        print('dividend', dividend)
        print('divisor', divisor)
        print('quotient', quotient)
        print('remainder', remainder)
        print('r1', r1)
        print('r2', r2)
      }
      return z
    } else {
      
      return equal(quotient, zero) && equal(dividend, remainder)
    }
  } else {
    return true // save time when divisor is random zero
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
    { title : 'identity'
   , fn: identity
   , args: [Integer]
   , analyze: analyzer(bigint_analyzer)
   , end: function(){  }
   }
 ,
   { title : 'additive commutativity'
   , fn: commutativity_add
   , args: [Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 ,
   { title : 'additive associativity'
   , fn: associativity_add
   , args: [Integer, Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , { title : 'subtract_sum'
   , fn: subtract_sum
   , args: [Integer, Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , { title : 'add_difference'
   , fn: add_difference
   , args: [Integer, Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , 
   { title : 'subtract_difference'
   , fn: subtract_difference
   , args: [Integer, Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , { title : 'multiplicative commutativity'
   , fn: commutativity_mul
   , args: [Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , { title : 'multiplicative associativity'
   , fn: associativity_mul
   , args: [Integer, Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
 , 
   { title : 'division back substitution'
   , fn: back_substitution_div
   , args: [Integer, Integer]
   , analyze: analyzer(bigint_analyzer, bigint_analyzer)
   , end: function(){  }
   }
]

function topoly(c, p){ return c + '*' + '(2^26)^' + p }
function toarr(id){
  var p = memory.adrs(id)
  var arr = []
  var size = memory.heap(p)
  var i = p + 2
  while ( i < p + size ) {
    arr.push(memory.heap(i++))
  }
  return arr
}
function topolynom(a){
  var sign = (memory.heap(memory.adrs(a)+1) & 1) ? '-' : '+' 
  return '(' + sign + toarr(a).map(topoly).join(sign) + ')'
}


var arr_to_int = integer.arr_to_int
// backsub 
//  var T = divide(a, b)
//  var q = T[0]
//  var r = T[1]
//  var s = add(multiply(q, b), r)

  /* subtraction
  var n = args[0]
  var m = args[1]
  var k = args[2]
  //console_log(debug.dump(memory.adrs()))
  //console_log(debug.dump(memory.heap()))
debugger
  var n_m = subtract(n, m)
  print('n_m', n_m)
  //console_log(debug.dump(memory.heap()))
  var n_m_k = subtract(n_m, k)
  print('n_m_k', n_m_k)
  var mk = add(m, k)
  print('mk', mk)
  var n_mk = subtract(n, mk)
  print('n_mk', n_mk)
  */


//;[
////  [get_random_bigint(), get_random_bigint()]
//].forEach()

//var times = 1000000
//
//while ( times-- > 0 ) {
//  bang(get_random_bigint(), get_random_bigint(), get_random_bigint())
//}

function bang(a, b, c){
  
  if ( !back_substitution_div(a, b) ) {
    console_log('n', topolynom(a))
    console_log('m', topolynom(b))
    //console_log('k', topolynom(c))
    var ac = clone(a)
    var bc = clone(b)
    //var cc = clone(a)
    console.log('check', back_substitution_div(ac, bc))
    throw new Error('failed')
  }
}


var times = 10
while (times -- > 0) {
  klara(3000, props)
}
