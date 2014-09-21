module.exports = divide
// http://bioinfo.ict.ac.cn/~dbu/AlgorithmCourses/Lectures/Hasselstrom2003.pdf
// http://www.treskal.com/kalle/exjobb/original-report.pdf
var noop = function(){}
var console_log = noop // console.log.bind(console)
var memory = require('./memory.js')
var pointers = memory.pointers
var values = memory.values
var numbers = memory.numbers
var temp = memory.temp

var one = require('./one.js')
var zero = require('./zero.js')
var β = require('./65536.js')

var compare = require('./integer_compare_abs.js')
var equal = require('./integer_equality.js')
var add = require('./integer_addition.js')
var subtract = require('./integer_subtraction.js')
var multiply = require('./integer_multiplication.js')

var left_shift = require('./integer_left_shift.js')
var right_shift = require('./integer_right_shift.js')

var to_int = require('./primitive_to_int.js')

var floor = Math.floor
var ceil = Math.ceil
var log = Math.log
var LN2 = Math.LN2
var base = 65536
var half_base = base / 2

var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)

var path = 0

function sub(A_idx, B_idx){
  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]
  var BR_idx = temp(size_b + 1)

  var pointer_br = pointers[BR_idx]
  var t_br = values[BR_idx]
  var data_br = t_br.data
  var didx_br = t_br.ads[pointer_br]

  data_br[didx_br + 1] = 0 // type integer
  data_br[didx_br + 2] = 0 // some garbage might be there

  // left shifting(actually right because order is reversed, although 
  // if I index bigits the same way bits usually are, it's 
  // still left, very confusing naming and conventions, really)
  for ( var i = 2; i < size_b; i++ ) {
    data_br[didx_br + i + 1] = data_b[didx_b + i]
  }

  if ( compare(A_idx, BR_idx) >= 0  ) {
   var C = subtract(A_idx, BR_idx, temp)
   var t = slowdiv(C, B_idx)
    return [add(t[0], β, temp), t[1]]
  }
  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var size_a = data_a[didx_a]

  //TODO: this to be removed
  if ( size_a < 4 ) throw new Error('size too small')
  var q = floor((base * data_a[didx_a + size_a - 1] + data_a[didx_a + size_a - 2]) / data_b[didx_b + size_b - 1])

  if ( q > base - 1 ) q = base - 1
  var Q = temp(3)
  var pointer_q = pointers[Q]
  var t_q = values[Q]
  var data_q = t_q.data
  var didx_q = t_q.ads[pointer_q]
  data_q[didx_q + 1] = 0 // type integer
  data_q[didx_q + 2] = q // value

  var T = multiply(Q, B_idx, temp)
  var corrected = false
  if ( compare(T, A_idx) > 0 ) {
    q = q - 1
    var T = subtract(T, B_idx, temp)
    corrected = true
  }
  if ( compare(T, A_idx) > 0 ) {
    q = q - 1
    var T = subtract(T, B_idx, temp)
  }
  if ( corrected ) {
    var Q = temp(3)
    var pointer_q = pointers[Q]
    var t_q = values[Q]
    var data_q = t_q.data
    var didx_q = t_q.ads[pointer_q]
    data_q[didx_q + 1] = 0 // type integer
    data_q[didx_q + 2] = q // value
  }
  return [Q, subtract(A_idx, T, temp)] 
}

function slowdiv(A_idx, B_idx){
  //console.log('MAXSIZE', get_max_size())

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]
  var most_significant_digit_b = data_b[didx_b + size_b - 1]
  if ( most_significant_digit_b < 32768 ) {

    var shifted = ceil(log(32768 / most_significant_digit_b) / LN2) 
    var As_idx = left_shift(A_idx, shifted, temp)
    var Bs_idx = left_shift(B_idx, shifted, temp)

    var pointer_a = pointers[As_idx]
    var t_a = values[As_idx]
    var m = t_a.data[t_a.ads[pointer_a]]

    var pointer_b = pointers[Bs_idx]
    var t_b = values[Bs_idx]
    var n = t_b.data[t_b.ads[pointer_b]]

    if ( m < n ) {
      return [zero, A_idx]
    }

    if ( m == n ) {
      var c = compare(As_idx, Bs_idx)
      if ( c < 0 ) return [zero, A_idx]
      if ( c == 0 ) return [one, zero]
      return [one, subtract(A_idx, B_idx, temp)]
    }

    if ( m == n + 1 ) {
      var qr = sub(As_idx, Bs_idx)
      return [qr[0], right_shift(qr[1], shifted, temp)]
    }

    var powerdiff = (m - n - 1) * 16
    var A_p = right_shift(As_idx, powerdiff, temp)
    var t3 = sub(A_p, Bs_idx, temp)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff, temp), subtract(As_idx, left_shift(A_p, powerdiff, temp), temp), temp), Bs_idx)

    return [add(left_shift(t3[0], powerdiff, temp), t4[0], temp), right_shift(t4[1], shifted, temp)]

  } else {

    var pointer_a = pointers[A_idx]
    var t_a = values[A_idx]
    var m = t_a.data[t_a.ads[pointer_a]]

    var pointer_b = pointers[B_idx]
    var t_b = values[B_idx]
    var n = t_b.data[t_b.ads[pointer_b]]

    if ( m < n ) {
      return [zero, A_idx]
    }

    if ( m == n ) {
      var c = compare(A_idx, B_idx)
      if ( c < 0 ) return [zero, A_idx]
      if ( c == 0 ) return [one, zero]
      return [one, subtract(A_idx, B_idx, temp)]
    }

    if ( m == n + 1 ) {
      // TODO probably we could just return qr here :-S
      var qr = sub(A_idx, B_idx)
      return [qr[0], qr[1]]
    }

    var powerdiff = (m - n - 1) * 16
    var A_p = right_shift(A_idx, powerdiff, temp)

    var t3 = sub(A_p, B_idx, temp)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff, temp), subtract(A_idx, left_shift(A_p, powerdiff, temp), temp), temp), B_idx)

    return [add(left_shift(t3[0], powerdiff, temp), t4[0], temp), t4[1]]
  }
}

function divide(dividend, divisor, storage){
  storage = storage || numbers
  var mark = temp(2) //get a handle to temp where I can reset the breaking point back to with free()
  var T = slowdiv(dividend, divisor)
  var q = T[0], r = T[1]

  var pointer_q = pointers[q]
  var t_q = values[q]
  var size_q = t_q.data[t_q.ads[pointer_q]]

  var pointer_r = pointers[r]
  var t_r = values[r]
  var size_r = t_r.data[t_r.ads[pointer_r]]

  var Q_idx = storage(size_q)
  var pointer_Q = pointers[Q_idx]
  var t_Q = values[Q_idx]
  data_q = t_q.data
  didx_q = t_q.ads[pointer_q]
  data_Q = t_Q.data
  didx_Q = t_Q.ads[pointer_Q]
  for ( var l = 0; l < size_q; l++ ) {
    data_Q[didx_Q + l] = data_q[didx_q + l]
  }

  var R_idx = storage(size_r)
  var pointer_R = pointers[R_idx]
  var t_R = values[R_idx]
  data_r = t_r.data
  didx_r = t_r.ads[pointer_r]
  data_R = t_R.data
  didx_R = t_R.ads[pointer_R]
  for ( var l = 0; l < size_r; l++ ) {
    data_R[didx_R + l] = data_r[didx_r + l]
  }
  memory.stacks.free(pointers[mark])
  return [Q_idx, R_idx]
}


