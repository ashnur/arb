void function(){
  // http://bioinfo.ict.ac.cn/~dbu/AlgorithmCourses/Lectures/Hasselstrom2003.pdf
  var pool = require('./pool.js')
  var one = require('./one.js')
  var zero = require('./zero.js')
  var compare = require('./integer_compare_abs.js')
  var equal = require('./integer_equality.js')
  var add = require('./integer_addition.js')
  var addp = require('./integer_add_primitive.js')
  var subtract = require('./integer_subtraction.js')
  var multiply = require('./integer_multiplication.js')
  var right_trim = require('./integer_right_trim.js')
  var left_shift = require('./integer_left_shift.js')
  var right_shift = require('./integer_right_shift.js')
  var to_int = require('./primitive_to_int.js')
  var log = console.log.bind(console)
  var floor = Math.floor
  var base = 65536

  var print = require('./test/helpers/print_int.js')

  function sub(A, B){
    var BR = left_shift(B, 16)
    if ( compare(A, BR) >= 0  ) {
      var t =  slowdiv(subtract(A, BR), B)
      return [addp(t[0], base), t[1]]
    }

    var n = A.length - 1
    A_p = n > 2 ? A[n - 1] : 0
    B_p = n > 2 ? B[n - 1] : 0
    var q = floor((base * A[n] + A_p) / B_p)
    if ( q > base - 1 ) q = base - 1
    var Q = to_int(q)
    var T = multiply(Q, B)
    if ( compare(T, A) >= 0 ) {
      q = q - 1
      T = subtract(T, B)
    }
    if ( compare(T, A) >= 0 ) {
      q = q - 1
      T = subtract(T, B)
    }
    return [to_int(q), subtract(A, T)]
  }

  function slowdiv(A, B){
    var n = B.length - 1
    var m = A.length - 1

    if ( m < n ) return [zero, A]

    if ( m == n ) {
      var c = compare(A, B)
      if ( c < 0 ) return [zero, A]
      if ( c == 0 ) return [one, zero]
      return [one, subtract(A, B)]
    }

    if ( m == n + 1 ) {
      return sub(A, B)
    }

    var shifted = 0
    if ( B[n] < 32768 ) {
      shifted = 16 - B[n].toString(2).length
      A = left_shift(A, shifted)
      B = left_shift(B, shifted)
    }

    var powerdiff = (m - n - 1) * 16
    var A_p = right_shift(A, powerdiff)
    var t3 = sub(A_p, B)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff), subtract(A, left_shift(A_p, powerdiff))), B)
    return [add(left_shift(t3[0], powerdiff), t4[0]), right_shift(t4[1], shifted)]
  }

  function divide(dividend, divisor){
    //log('input', dividend+'', divisor+'')
    if ( equal(zero, divisor) ) throw new Error('division by zero')
    if ( equal(zero, dividend) ) return [zero, divisor]
    if ( equal(one, divisor) ) return [dividend, zero]
    var R = slowdiv(dividend, divisor)
    return [right_trim(R[0]), right_trim(R[1])]
  }

  module.exports = divide
}()
