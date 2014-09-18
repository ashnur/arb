module.exports = left_shift
var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var numbers = memory.numbers
var temp = memory.temp

var print = require('./print.js')

var equal = require('./integer_equality.js')

var one = require('./one.js')
var zero = require('./zero.js')

function left_shift(I_idx, n, storage){
  if ( equal(I_idx, zero) ) return zero
    //console.log('left shift ---------->')
  storage = storage || numbers
//print('I', I_idx)
//console.log('n', n)
  var words = n >>> 4 // floor(n/16)
  var bits = n & 15 // n % 16
  var offset_bits = 16 - bits
//console.log('words', words)
//console.log('bits', bits)
//console.log('offset_bits', offset_bits)

  var pointer_i = pointers[I_idx]
  var t_i = values[I_idx]
  var size_i = t_i.data[t_i.ads[pointer_i]]

  // size of the returned bigint will be the size of the input + the number of words it will be
  // extended with
  // and depending on the most significant bigit's size 1 or 0 more
  var msdi = t_i.data[t_i.ads[pointer_i] + size_i - 1]
  //console.log('leading digit', msdi)
  var bits_word = ((t_i.data[t_i.ads[pointer_i] + size_i - 1] << bits) >= 65536 ? 1 : 0)
  //console.log('Ss', msdi << bits )
  //console.log('bw', bits_word)
  var R_idx = storage(size_i + words + bits_word)
  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]
  data_r[didx_r + 1] = 0 // type integer

  // data index has to be read AFTER the allocation because 
  // the allocation might change the indeces received
  var data_i = t_i.data
  var didx_i = t_i.ads[pointer_i]

  // clean possible garbage
  for ( var i = 2; i < words + 2; i++ ) {
    data_r[didx_r + i] = 0
  }

  if ( bits > 0 ) {

    var carry = 0
    for ( var j = 2; j < size_i; j++ ) {
      data_r[didx_r + words + j] = carry + (data_i[didx_i + j] << bits)
      carry = data_i[didx_i + j] >>> offset_bits
    }
    data_r[didx_r + words + j] = carry

  } else {
      
    for ( var i = 2; i < size_i; i++ ) {
      data_r[didx_r + words + i] = data_i[didx_i + i]
    }
  }
//print('R', R_idx)
  //console.log('<------- left shift')
  return R_idx
}
