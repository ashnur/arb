module.exports = multiply
var memory = require('./memory.js')
var numbers = memory.numbers
var temp = memory.temp
var pointers = memory.pointers
var values = memory.values

var one = require('./one.js')
var zero = require('./zero.js')
var equal = require('./integer_equality.js')

var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var slice = liberate(Array.prototype.slice)

var debug = require('./debug.js')

function multiply(A_idx, B_idx, storage) {
  if ( equal(A_idx, zero) ) return zero
  if ( equal(B_idx, zero) ) return zero
  if ( equal(A_idx, one) ) return B_idx
  if ( equal(B_idx, one) ) return A_idx
  storage = storage || numbers

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]

  var size_a = t_a.data[t_a.ads[pointer_a]]
  var size_b = t_b.data[t_b.ads[pointer_b]]

  var t = temp(size_a + size_b - 2) // header(2 blocks) is in both, so has to be removed
  // console.log('----------------------------------', get_max_size())

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]

  var pointer_t = pointers[t]
  var t_t = values[t]

  var data_t = t_t.data
  var didx_t = t_t.ads[pointer_t]

  data_t[didx_t + 1] = 0 // type integer
//  console.log(data_t == data_b, didx_t, didx_b, pointer_a, pointer_b, pointer_t)
  for ( var i = 2; i < data_t[didx_t]; i++ ) data_t[didx_t + i] = 0 // get rid of garbage

  var tj = 0
  var c = 0
  var n = 0

  for ( var i = 2; i < size_a; i++ ) {
    var a = data_a[didx_a + i]
    n = 0
    for ( var j = 2; j < size_b; j++ ) {
      c = n
      tj = a * data_b[didx_b + j] + data_t[didx_t + i + j - 2] + c
      data_t[didx_t + i + j - 2] = tj & 65535
      n = tj >>> 16
    }
    data_t[didx_t + i + size_b - 2] = n
  }


  var trailing_zeroes = 0
  var k = size_a + size_b - 3 + didx_t
  while ( k > didx_t + 2 && data_t[k] == 0) {
    k--
    trailing_zeroes++
  }

  var size_r = size_a + size_b  - trailing_zeroes - 2
  if ( trailing_zeroes ) data_t[didx_t] = size_r

  var R_idx = storage(size_r)

  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  data_r = t_r.data
  didx_r = t_r.ads[pointer_r]
  for ( var l = 0; l < size_r; l++ ) {
    data_r[didx_r + l] = data_t[didx_t + l]
  }
  memory.stacks.free(pointer_t)

  return R_idx
}
