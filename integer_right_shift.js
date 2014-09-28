module.exports = right_shift
var memory = require('./memory.js')
var pointers = memory.pointers
var values = memory.values
var numbers = memory.numbers
var temp = memory.temp
var floor = Math.floor
var zero = require('./zero.js')
var equal = require('./integer_equality.js')

function right_shift(I_idx, n, storage){
  if ( equal(I_idx, zero) ) return zero
  if ( n == 0 ) return I_idx
  storage = storage || numbers
  var words = (n / 26) | 0 
  var bits = n % 26
  var offset_bits = 26 - bits

  var pointer_i = pointers[I_idx]
  var t_i = values[I_idx]
  var size_i = t_i.data[t_i.ads[pointer_i]]
  var most_significant_bigit_i = t_i.data[t_i.ads[pointer_i] + size_i - 1]
  var bit_offset = ( most_significant_bigit_i >>> bits ? 0 : 1)
  var size_r = size_i - words - bit_offset 
  if ( size_r < 2 ) throw new Error('you shifted so much to the right, you came back on the left side!')

  var R_idx = storage(size_r)
  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]
  data_r[didx_r + 1] = 0 // type integer

  var data_i = t_i.data
  var didx_i = t_i.ads[pointer_i]

  for ( var j = 2 + words, i = 2; j < size_i ; j++, i++ ) {
    data_r[didx_r + i] = ((data_i[didx_i + j] >>> bits) + ( j + 1 < size_i ? data_i[didx_i + j + 1] << offset_bits : 0)) & 0x3ffffff
  }

  var trailing_zeroes = 0
  var k = didx_r + size_r - 1
  while ( k > didx_r + 2 && data_r[k] == 0) {
    k--
    trailing_zeroes++
  }

  if ( trailing_zeroes ) data_r[didx_r] = size_r - trailing_zeroes
  return R_idx
}
