module.exports = left_pad
var memory = require('./memory.js')
var malloc = memory.alloc
var heap = memory.data
var ads = memory.ads
var print = require('./print.js')

function left_pad(A, by){
  var aidx = ads[A]
  var size = heap[aidx] + by

  var R = malloc(size + 2)
  heap[R] = 0 //type integer

  var ridx = ads[R]
  heap[ridx] = size

  var i = - by
  while ( ads[ridx] != 0 ) {
    i++
    ridx = ads[ridx]
    if ( i > 0 ) {
      aidx = ads[aidx]
      heap[ridx] = heap[aidx]
    }
  }
  return R
}
