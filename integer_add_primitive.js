module.exports = add_number
var memory = require('./memory.js')
var alloc = memory.alloc
var data = memory.data
var ads = memory.ads
var free = memory.free
var zero = require('./zero.js')
var right_trim = require('./integer_right_trim.js')
var equal = require('./integer_equality.js')
var to_int = require('./primitive_to_int.js')
var left_pad = require('./left_pad.js')
var max = Math.max
var log10 = Math.log
var floor = Math.floor

function add_number(A, num, idx){
  idx = idx || 0
  if ( num == 0 ) return A
  var aidx = ads[A]
  var a_size = data[aidx]
  if ( equal(A, zero) ) return left_pad(to_int(num), idx)
  var R_size = max(a_size, 1 + floor(log10(num) / log10(65536))) + 1 + idx
  var R = alloc(R_size + 2)
  data[R] = 0 //type integer
  var ridx = ads[R]
  data[ridx] = R_size
  for ( var i = 0; i < idx; i++ ) {
    ridx = ads[ridx]
    aidx = ads[aidx]
    data[ridx] = i <= a_size ? data[aidx] : 0
  }
  for ( var i = idx; i <= R_size; i++ ) {
    ridx = ads[ridx]
    aidx = ads[aidx]
    num = i <= a_size ? data[aidx] + num : num
    data[ridx] = num
    if ( num > 0 ) num = floor(num / 65536)
  }
  return right_trim(R)

}

