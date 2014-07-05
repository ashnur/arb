module.exports = clone
var memory = require('./memory.js')
var malloc = memory.alloc
var heap = memory.data
var ads = memory.ads
function clone(pointer){
  var type = heap[pointer]
  var pidx = ads[pointer]
  var size = heap[pidx]
  var c =  malloc(size + 2)
  heap[c] = type
  var cidx = ads[c]
  heap[cidx] = size

  while ( pidx != 0 ) {
    cidx = ads[cidx]
    pidx = ads[pidx]
    heap[cidx] = heap[pidx]
  }
  return c
}
