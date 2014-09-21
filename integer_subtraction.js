module.exports = subtract

var liberate = require('liberate')
var map = liberate(Array.prototype.map)

var ZERO = require('./zero.js')
var compare = require('./integer_compare_abs.js')
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

function subtract(A_idx, B_idx, storage){
  storage = storage || numbers

  var comp = compare(A_idx, B_idx)
  if ( comp == 0 ) {
    return ZERO
  } else if ( comp < 0 ) {
    // TODO
    // maybe instead of swapping the input order
    // it would be better to have the
    // algorith implemented for both orders
    var temp = A_idx
    A_idx = B_idx
    B_idx = temp
  }

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]

  var size_r = t_a.data[t_a.ads[pointer_a]]

  var R_idx = storage(size_r)

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]
  var size_a = data_a[didx_a]

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]

  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]

  data_r[didx_r + 1] = 0 // type integer

  var r = 0
  var carry = 0

  for ( var i = 2; i < size_b; i ++ ) {
    r = data_a[didx_a + i] - data_b[didx_b + i] + carry
    if ( r < 0 ) {
      data_r[didx_r + i] = r + 65536
      carry = -1
    } else {
      data_r[didx_r + i] = r
      carry = 0
    }
  }
  for ( ; i < size_a; i ++ ) {
    r = data_a[didx_a + i] + carry
    if ( r < 0 ) {
      data_r[didx_r + i] = r + 65536
      carry = -1
    } else {
      data_r[didx_r + i] = r
      carry = 0
    }
  }
  data_r[didx_r + i] += carry

  var trailing_zeroes = 0
  while ( data_r[didx_r + (--i)] == 0 && i > 1) {
    trailing_zeroes++
  }
  if ( trailing_zeroes ) data_r[didx_r] = size_r - trailing_zeroes

  return R_idx
}

