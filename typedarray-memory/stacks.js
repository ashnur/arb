module.exports = Memory

var noop = function(){}
var console_log = noop // console.log.bind(console)

var Address = require('./address.js')
var resize = require('./resize.js')
var resize_naive = require('./resize_naive.js')
var max = Math.max

var liberate = require('liberate')
var map = liberate(Array.prototype.map)

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
  , free: free
  , brk: function(){return [brk, next]}
  }

  function alloc(length){
    console_log('alloc',  (new Error).stack.match(/([\w\.]+\/[\w\.]+:\d+:\d+)/g)[2])
    var pre = get_max_size() + '\n' + dumpta(heap.ads)+ '\n' +dumpv(heap.ads) + '\n' + dumpta(heap.data)
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
      console_log('alloc resize')
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    //MS(pre, 'allocated resized')
    return pointer
  }

  function free(pointer){
    console_log('free', pointer,  (new Error).stack.match(/([\w\.]+:\d+:\d+)/g)[1])
    if ( pointer == 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    brk = heap.ads[pointer]
    next = pointer
  }

  function extend(needed){
    console_log('extend')
    //var pre = get_max_size() + '\n' + dumpta(heap.ads)+ '\n' +dumpv(heap.ads) + '\n' + dumpta(heap.data)
    var from = new Error()
    var cl  = heap.data.length
    var nl = max(cl * 2, cl - unallocated + needed)
    if ( nl >= Math.pow(2, heap.ads.BYTES_PER_ELEMENT) ) {
      console_log('extend resize')
      heap.ads = resize(heap.ads, heap.ads.length , nl)
    }
    console_log('!!!!', dumpta(heap.ads))
    var update = resize_naive(heap.ads, next, heap.data, nl, brk)
    console_log('¡¡¡¡', dumpta(heap.ads))
    heap.data = update.data
    heap.ads = update.ads
    //MS(pre, 'extended after resize')
    brk = update.brk
    unallocated = heap.data.length - brk - 1
  }

function s(pointer){
  return heap.data[pointer]
}

function get_max_size(){
  var ms = max.apply(null, map(heap.ads, s))
  return ms
}

function MS(pre, name){

    var ms = get_max_size()
    if ( ms > 30  ) {
      console_log(name)
      console_log(pre)
      console_log(ms)
      console_log(dumpta(heap.ads))
      console_log(dumpv(heap.ads))
      console_log(dumpta(heap.data))
      throw new Error('FINISH It!!!!')
    }
}



  return heap
function id(x){ return [x, heap.data[x]] }
function dumpv(ta){
  return map(ta, id).join(' | ')
}
function dumpta(ta){
  return map(ta, id).join(',')
}

}
function findlast(ta){
  var last = 0
  for ( var i = 0; i < ta.length; i++ ) {
    if ( ta[i] > 0 ) last = i
  }
  return last
}

//function id(x){ return x }

function below(limit){ return function(_,i){ return i < limit } }
function between(from, to){ return function(_,i){ return i >= from && i <= to } }


//function dumpta(ta, from, limit){
//  return map(ta, id).filter(between(from, from + limit)).join(',')//.replace(/(?:,0)*$/,'').split(',')
//}

