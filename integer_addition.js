module.exports = add
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var free = memory.free
var zero = require('./zero.js')
var equal = require('./integer_equality.js')
var max = Math.max
var min = Math.min
var right_trim = require('./integer_right_trim.js')

function add(A, B){
  if ( equal(A, zero) ) return B
  if ( equal(B, zero) ) return A
  var aidx = ads[A]
  var bidx = ads[B]
  var A_size = data[aidx]
  var B_size = data[bidx]
  if ( A_size < B_size ) {
    var t = A
    A = B
    B = t

    t = A_size
    A_size = B_size
    B_size = t

    t = aidx
    aidx = bidx
    bidx = t
  }
  var R_size = A_size + 1
  var R = alloc(R_size + 2)
  data[R] = 0 // type integer

  var rsizeidx = ads[R]
  data[rsizeidx] = R_size
  var ridx = rsizeidx


  var carry = 0
  var partial = 0
  var i = 0
  var limit = B_size
  while ( i < limit ) {
    aidx = ads[aidx]
    bidx = ads[bidx]
    ridx = ads[ridx]
    partial = data[aidx] + data[bidx] + carry
    data[ridx] = partial
    carry = partial > 65535 ? 1 : 0
    i ++
  }
  limit = A_size
  while ( i < limit ) {
    aidx = ads[aidx]
    ridx = ads[ridx]
    partial = data[aidx] + carry
    data[ridx] = partial
    carry = partial > 65535 ? 1 : 0
    i ++
  }

  ridx = ads[ridx]
  if ( carry ) {
    data[ridx] += carry
  } else {
    data[rsizeidx] = R_size -1
    free(ads[ridx])
    ads[ridx] = 0
  }

  return R
}
