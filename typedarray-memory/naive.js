module.exports = Memory

function Memory(type, size, silent){
  silent = silent || true

  var data = new type(length)
  var address = Address(size)

  var brk
  var last
  var unallocated = size

  init()

  function init(){
    for ( var i = 1; i < address.length - 1 ; i ++ ) {
      address[i] = i + 1
    }
    brk = 1
    last = i
  }

  function alloc(length){
    // there is no check for it but length has to be larger than 0
    if ( length > unallocated ) {
      throw new Error('run out of memory')
      // here we going to enlarge the heap eventually
    }
    unallocated -= length
    var pointer = brk
    var end = pointer
    while ( --length > 0 && end ) { // end is part of while to defend against in-dev hiccups when we would get infinite recursion otherwise
      var end = address[end]
    }
    brk = unallocated ? address[end] : 0
    if ( brk ) {
      address[last] = brk
    } else {
      last = 0
    }
    address[end] = 0
    return pointer
  }

  function free(pointer){
    if ( pointer == 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    var prev = pointer
    var next = address[prev]
    var count = 1
    while ( next != 0 ) {
      data[prev] = 0
      prev = next
      next = address[prev]
      count++
    }
    data[prev] = 0
    if ( brk ) {
      address[prev] = brk
      address[last] = pointer
    } else {
      address[prev] = pointer
      last = prev
    }
    brk = pointer
    unallocated += count

  }

  return {
    data: data
  , ads: address
  , alloc: alloc
  , free: free
  , brk: function(){ return brk}
  , lst: function(){ return last}
  , unalloc: function(){ return unallocated}
  }

}
