module.exports = add
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

var max = Math.max
var min = Math.min

var zero = require('./zero.js')
var equal = require('./integer_equality.js')

function add(A_idx, B_idx){
  if ( equal(A_idx, zero) ) return B_idx
  if ( equal(B_idx, zero) ) return A_idx
  var pointer_a = pointers[A_idx]
  var pointer_b = pointers[B_idx]

  var t_a = values[A_idx]
  var t_b = values[B_idx]

  var data_a = t_a.data
  var data_b = t_b.data

  var didx_a = t_a.ads[pointer_a]
  var didx_b = t_b.ads[pointer_b]

  var size_a = t_a.data[didx_a]
  var size_b = t_b.data[didx_b]

  if ( size_a < size_b ) {
    // maybe instead of swapping the input order
    // it would be better to have the addition
    // algorith implemented for both orders
    var temp = A_idx
    A_idx = B_idx
    B_idx = temp

//    temp = pointer_a
//    pointer_a = pointer_b
//    pointer_b = temp

    var ttemp = data_a
    data_a = data_b
    data_b = ttemp

    temp = didx_a
    didx_a = didx_b
    didx_b = temp

    temp = size_a
    size_a = size_b
    size_b = temp
  }

  var size_r = size_a + 1
  var R_idx = numbers(size_r + 2)

  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]

  data_r[didx_r + 1] = 0 // type integer

  var carry = 0
  var partial = 0

  for ( var i = 2; i < size_b; i ++ ) {
    partial = data_a[didx_a + i] + data_b[didx_b + i] + carry
    data_r[didx_r + i] = partial
    carry = partial > 65535 ? 1 : 0
  }

  for ( ; i < size_a; i ++ ) {
    partial = data_a[didx_a + i] + carry
    data_r[didx_r + i] = partial
    carry = partial > 65535 ? 1 : 0
  }

  if ( carry ) {
    data_r[didx_r + i] += carry
  } else {
    data_r[didx_r] = size_r - 1
  }

  return R_idx
}
