module.exports = subtract
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var free = memory.free
var compare = require('./integer_compare_abs.js')
var ZERO = require('./zero.js')
var right_trim = require('./integer_right_trim.js')
var print = require('./print.js')

function is_pow2(n){
  return n && !(n & (n - 1))
}

function subtract(A, B){
  var comp = compare(A, B)
  if ( comp == 0 ) {
    return ZERO
  } else if ( comp > 0 ) {
    var T = B
    B = A
    A = T
  }
  var aidx = ads[A]
  var bidx = ads[B]

  var A_size = data[aidx]
  var B_size = data[bidx]

  var R_size = B_size
  var R = alloc(R_size + 2)

  data[R] = 0 // type integer

  var ridx = ads[R]
  data[ridx] = R_size
//console.log('size', R_size)

  var i = 0
  var r = 0
  var carry = 0

  while ( i < A_size ) {
    aidx = ads[aidx]
    bidx = ads[bidx]
    ridx = ads[ridx]
    r = data[bidx] - data[aidx] + carry
    if ( r < 0 ) {
      data[ridx] = r + 65536
      carry = -1
    } else {
      data[ridx] = r
      carry = 0
    }
    i++
  }
  while ( i < B_size ) {
    bidx = ads[bidx]
    ridx = ads[ridx]
    r = data[bidx] + carry
    if ( r < 0 ) {
      data[ridx] = r + 65536
      carry = -1
    } else {
      data[ridx] = r
      carry = 0
    }
    i++
  }
  ridx = ads[ridx]
  data[ridx] += carry

  return right_trim(R)
}

