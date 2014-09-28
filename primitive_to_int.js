module.exports = to_int
var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var numbers = memory.numbers
var temp = memory.temp

var floor = Math.floor
var logn = Math.log

var zero = require('./zero.js')
var one = require('./one.js')

var logn2_26 = logn(0x4000000)

function to_int(num, storage){
  if ( num == 0 ) return zero
  if ( num == 1 ) return one
  storage = storage || numbers

  var size_r = 3 + floor(logn(num) / logn2_26)

  var R_idx = storage(size_r)
  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]
  data_r[didx_r + 1] = 0 // type integer
  for ( var i = 2; i < size_r; i++ ) {
    data_r[didx_r + i] = num
    num = num >>> 26
  }

  return R_idx
}
