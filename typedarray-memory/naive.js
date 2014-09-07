module.exports = Memory

var Address = require('./address.js')
var resize = require('./resize.js')
var resize_naive = require('./resize_naive.js')
var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)

function log(){
//  console.log.apply(console, arguments)
}

function Memory(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var data = new type(size)
  var address = Address(size, size)

  var unallocated = size - 1
  var brk = 1 // this is the next data index. zero means it's freed
  var next = 0 // this is the next address index.

  var heap = {
    data: data
  , ads: address
  , alloc: alloc
  , free: free
  }

  function alloc(length){
    // TODO: remove this conditional
    if ( length < 2 ) throw new Error('srsly wtf')
    // there is no check for it but length has to be larger than 0
    //log('naive alloc ----- length: ', length)
    //log('ads')
    //log(dumpta(heap.ads))
    //log('data')
    //log(dumpta(heap.data))
    log('brk before', brk)
    if ( length > unallocated ) {
      extend(length)
      log('brk extended', brk)
    //  log('data')
    //  log(dumpta(heap.data))
    }
    unallocated -= length
    // save data index to data_idx and advance the break point with length
    var data_idx = brk
    brk = brk + length
    log('brk after', brk)
//    log('----- end naive alloc dump')
    // save data_idx in address space and advance next
    var pointer = next
    next++
    if ( pointer == address.length ) {
      heap.ads = address = resize(address, address.length * 2, data.length)
    }
    address[pointer] = data_idx
    return pointer
  }

function id(x){ return x }

function dumpta(ta){
  return map(ta, id).join(',')
  //.replace(/(?:,0)*$/,'').split(',')
}
  function free(pointer){
    if ( pointer == 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    address[pointer] = 0
  }

  function extend(needed){
    var cl  = data.length
    var nl = max(cl * 2, cl - unallocated + needed)
    var update = resize_naive(address, next, data, nl)
    heap.data = data = update.data
    brk = update.brk
    unallocated = data.length - brk - 1
  }

  return heap

}
