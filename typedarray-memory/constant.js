module.exports = Memory

var Address = require('./address.js')
var resize = require('./resize.js')
var max = Math.max

function Memory(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index.
  var next = 1 // this is the next address index.
  var heap = {
    data: new type(size)
  , ads: Address(size, size)
  , alloc: alloc
  }

  function alloc(length){
    // there is no check for it but length has to be larger than 0
    if ( length > unallocated ) {
      extend(length)
    }
    unallocated -= length
    // save data index to data_idx and advance the break point with length
    var data_idx = brk
    brk = brk + length
    // save data_idx in address space and advance next
    var pointer = next++
    if ( pointer == heap.ads.length ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    return pointer
  }

  function extend(needed){
    heap.data = resize(heap.data, max(size * 2, size - unallocated + needed), heap.data.length)
  }

  return heap
}
