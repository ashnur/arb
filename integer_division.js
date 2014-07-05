module.exports = divide
// http://bioinfo.ict.ac.cn/~dbu/AlgorithmCourses/Lectures/Hasselstrom2003.pdf
// http://www.treskal.com/kalle/exjobb/original-report.pdf
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
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
var half_base = base / 2

var print = require('./print.js')
//var guard = 100
function sub(A, B){
//  if( ! (--guard) ) throw new Error ('nope')
  var BR = left_shift(B, 16)
//print('A ', A)
//print('B ', B)
//print('BR', BR)
//console.log('comp', compare(A, BR))
  if ( compare(A, BR) >= 0  ) {
    var t = slowdiv(subtract(A, BR), B)
    memory.free(BR)
    return [addp(t[0], base), t[1]]
  }

  // n is the last element
  // var n = A.length - 1
  // find size of A
  var a_size = data[ads[A]]
  // here we are reading the penultimate elements, second most significant elements
  // if last index is more than two, so the size is more than 1 (before this version size 2 was 0, single digits were size 3. now we subtract 2)
  // we use 2nd msd, otherwise 0
  // var A_p = n > 2 ? A[n - 1] : 0
  // var B_p = n > 2 ? B[n - 1] : 0

  if ( a_size > 1 ) {
    // find last 2 indeces of A
    var asmsdidx = ads[ads[A]]
    var amsdidx = ads[asmsdidx]
    var next_aidx = ads[amsdidx]
//console.log('az', asmsdidx, amsdidx, next_aidx)
    while ( next_aidx != 0 ) {
      var asmsdidx = amsdidx
      var amsdidx = next_aidx
      var next_aidx = ads[next_aidx]
    }
    // find last 2 indeces of B
    var bmsdidx = ads[ads[B]]
    var next_bidx = ads[bmsdidx]
    while ( next_bidx != 0 ) {
      var bmsdidx = next_bidx
      var next_bidx = ads[next_bidx]
    }
    var A_msd = data[amsdidx]
    var A_p = data[asmsdidx]
    var B_p = data[bmsdidx]
  } else {
    var A_p =  0
    var B_p =  0
  }


  var q = floor((base * data[amsdidx] + A_p) / B_p)
//console.log('aix', asmsdidx, amsdidx)
//console.log('ax', A_p, A_msd)
//console.log('bix', bmsdidx)
//console.log('bx', B_p)
//console.log('(base * data[amsdidx] + A_p)', (base * data[amsdidx] + A_p))
//console.log('q', q)
//console.log('q > base - 1', q > base - 1)


  // after this, no modifications are needed

  if ( q > base - 1 ) q = base - 1
  var Q = to_int(q)
  var T = multiply(Q, B)
  if ( compare(T, A) > 0 ) {
    q = q - 1
    var T1 = subtract(T, B)
    memory.free(T)
  }
  if ( compare(T1 || T, A) > 0 ) {
    q = q - 1
    var T2 = subtract(T1, B)
    if ( T1 != one && T1 != zero) memory.free(T1)
  }
  return [to_int(q), subtract(A, T2 || T1 || T)]
}

function slowdiv(A, B){

  // find B's most significant digit's index
  var next_index = ads[ads[B]]
  do {
    var bmsdidx = next_index
    next_index = ads[next_index]
  } while ( next_index != 0 )

  if ( data[bmsdidx] < 32768 ) {

    var shifted = 16 - data[bmsdidx].toString(2).length
    A = left_shift(A, shifted)
    B = left_shift(B, shifted)

    var m = data[ads[A]]
    var n = data[ads[B]]

    if ( m < n ) {
      return [zero, right_shift(A, shifted)]
    }

    if ( m == n ) {
      var c = compare(A, B)
      if ( c < 0 ) return [zero, right_shift(A, shifted)]
      if ( c == 0 ) return [one, zero]
      return [one, right_shift(subtract(A, B), shifted)]
    }

    if ( m == n + 1 ) {
      var qr = sub(A, B)
      return [qr[0], right_shift(qr[1], shifted)]
    }

    var powerdiff = (m - n - 1) * 16
    var A_p = right_shift(A, powerdiff)
    var t3 = sub(A_p, B)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff), subtract(A, left_shift(A_p, powerdiff))), B)
    memory.free(A_p)
    memory.free(A)
    memory.free(B)
    return [add(left_shift(t3[0], powerdiff), t4[0]), right_shift(t4[1], shifted)]

  } else {

    var m = data[ads[A]]
    var n = data[ads[B]]

    if ( m < n ) {
      return [zero, A]
    }

    if ( m == n ) {
      var c = compare(A, B)
      if ( c < 0 ) return [zero, A]
      if ( c == 0 ) return [one, zero]
      return [one, subtract(A, B)]
    }

    if ( m == n + 1 ) {
      var qr = sub(A, B)
      return [qr[0], qr[1]]
    }

    var powerdiff = (m - n - 1) * 16
    var A_p = right_shift(A, powerdiff)
    var t3 = sub(A_p, B)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff), subtract(A, left_shift(A_p, powerdiff))), B)
    memory.free(A_p)
    return [add(left_shift(t3[0], powerdiff), t4[0]), t4[1]]
  }

}

function divide(dividend, divisor){
  var R = slowdiv(dividend, divisor)
  return [right_trim(R[0]), right_trim(R[1])]
}

