module.exports = Memory

var Address = require('./address.js')
var resize = require('./resize.js')
var resize_naive = require('./resize_naive.js')
var max = Math.max

function Memory(type, size, silent){
  silent = silent || true

  var data = new type(size)
  var address = Address(size)

  var unallocated = size
  var brk = 1 // this is the next data index. if it's zero we ran out of space
  var next = 0 // this is the next address index. it should be never zero
  var heap = {
    data: data
  , ads: address
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
    var pointer = next++
    if ( pointer == address.length ) {
      address = resize(address, address.length * 2)
    }
    address[pointer] = data_idx
    return pointer
  }

  function free(pointer){
    if ( pointer == 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    brk = address[pointer]
    next = pointer
  }

  function extend(needed){
    var update = resize_naive(address, data, max(size * 2, size - unallocated + needed) )
    heap.data = data = update.data
    brk = update.brk
    unallocated = (data.length) - (size - unallocated)
  }

  return heap

}
