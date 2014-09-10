module.exports = Memory

var Address = require('./address.js')
var resize = require('./resize.js')
var resize_naive = require('./resize_naive.js')
var max = Math.max

function Memory(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index. zero means it's freed
  var next = 0 // this is the next address index.

  var heap = {
    data: new type(size)
  , ads: Address(size, size)
  , alloc: alloc
  , free: free
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
    var pointer = next
    next++
    if ( pointer == heap.ads.length ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    if ( heap.ads[pointer] !== data_idx ) {
      throw new Error('overflow')
      // console.log('overflow', data_idx, heap.ads[pointer])
    }
    return pointer
  }

  function free(pointer){
    if ( pointer == 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    heap.ads[pointer] = 0
  }

  function extend(needed){
    var cl  = heap.data.length
    var nl = max(cl * 2, cl - unallocated + needed)
    if ( nl >= Math.pow(2, heap.ads.BYTES_PER_ELEMENT) ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, nl)
    }
    var update = resize_naive(heap.ads, next, heap.data, nl, brk)
    heap.data = update.data
    brk = update.brk
    unallocated = heap.data.length - brk - 1
  }

  return heap

}
