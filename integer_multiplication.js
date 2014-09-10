module.exports = multiply
var memory = require('./memory.js')
var numbers = memory.numbers
var temp = memory.temp
var pointers = memory.pointers
var values = memory.values

var one = require('./one.js')
var zero = require('./zero.js')
var equal = require('./integer_equality.js')

function multiply(A_idx, B_idx){
  if ( equal(A_idx, zero) ) return zero
  if ( equal(B_idx, zero) ) return zero
  if ( equal(A_idx, one) ) return B_idx
  if ( equal(B_idx, one) ) return A_idx

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]

  var size_a = data_a[didx_a]
  var size_b = data_b[didx_b]


  var t = temp(size_a + size_b - 2) // header(2 blocks) is in both, so has to be removed
  var pointer_t = pointers[t]
  var t_t = values[t]
  var data_t = t_t.data
  var didx_t = t_t.ads[pointer_t]

  data_t[didx_t + 1] = 0 // type integer
  for ( var i = 2; i < data_t[didx_t]; i++ ) data_t[didx_t + i] = 0

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

  var R_idx = numbers(size_r)
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
