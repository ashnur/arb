void function(){
  var pool = require('./pool.js')
  var one = require('./one.js')()
  var zero = require('./zero.js')
  var compare = require('./integer_compare_abs.js')
  var equal = require('./integer_equality.js')
  var add = require('./integer_addition.js')
  var subtract = require('./integer_subtraction.js')
  var multiply = require('./integer_multiplication.js')
  var right_trim = require('./integer_right_trim.js')
  var left_shift = require('./integer_left_shift.js')

  var R = 65536

  function sub(A, B){
    // 0 <= A < R^(n+1)
    // R^n/2 <= B < R^n
    var BR = left_shift(B, 16)
    if ( compare(A, BR) >= 0  ) return sub(subtract(A, multiply(B,R), B))
    var q = floor((RA * A[A.length - 1] + A[A.length - 2]) / B[B.length - 1])
    var T = q*B
    while ( compare(T, A) >= 0 ) {
      q = q - 1
      T = subtract(T, B)
    }

    return [q, subtract(A, T)]
  }

var log = console.log.bind(console)
  function short_div(dividend, divisor){
    if ( dividend.length == 2 ) return [Math.floor(dividend[2] / divisor[2]), ((dividend[2] % divisor[2]) + divisor[2]) % divisor[2]]
    var n_size = dividend[1]
    var q = pool('integer', n_size)
    for ( var i = dividend.length - 1; i > 1; i-- ) {
      //q[i] =
    }
    return [right_trim(q), right_trim(r)]
  }

  function divide(dividend, divisor){
log('input', dividend+'', divisor+'')

    if ( equal(zero, divisor) ) throw new Error('division by zero')
    if ( equal(zero, dividend) ) return [zero, divisor]
    if ( equal(one, divisor) ) return [dividend, zero]
    if ( divisor.length == 1) return short_div(dividend, divisor)
    var c = compare(dividend, divisor)
    if ( c == 0 ) return [one, zero]
    if ( c == -1 ) return [zero, dividend]

    var quotiend
    //while ( (c = compare(dividend, divisor)) == -1 ) {

    //}

    var n_size = dividend[1]
    var d_size = divisor[1]
    var remainder = pool('integer', n_size, dividend)
    var part = pool('integer', d_size, dividend)
    var quotient = pool('integer', n_size)

    while ( compare(remainder, divisor) > 0 ) {

    }


    var result = [right_trim(quotient), right_trim(remainder)]
log('result', result[0]+'', result[1]+'')
    return result
  }

  module.exports = divide
}()
