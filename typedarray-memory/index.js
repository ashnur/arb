module.exports = Memory
var rand = Math.random

function getPool(type, length, count){
  var pool = Array(count)
  while ( count-- > 0 ){
    pool.push(new type(length))
  }
  return pool
}

function addr_type(length){
  if ( (length) <= 256 ) {
    return Uint8Array
  } else if ( (length) <= Math.pow(2, 16) ) {
    return Uint16Array
  } else if ( (length) <= Math.pow(2, 32) ) {
    return Uint32Array
  } else if ( size > Math.pow(2, 32) ) {
    throw new Error('Maximum size is 2^32 - 1. You gave: '+ size + cnstsize)
  }
}

function getAddress(size, count){
  var pool = Array(count)
  var type = addr_type(size)
  while ( count-- > 0 ){
    pool.push(new type(size))
  }
  return pool
}

function Memory(type, size, cnstsize, silent){
  silent = silent || true

  // have a pool of memory blocks
  // need 1 for constants
  // need 1 for numbers
  // need 1 for buffer
  // need 1 for defrag 
  var blocks = getPool(type, length, 4)
  var numbercount = Math.round(length/3)
  // the /3 is quite arbitrary here, but the reasoning is that 2^48 is less than the largest integer in js, 
  // so on average, the bigints should be at least this large.
  // That is, if the numbers someone works with are less than 2^53, then there is no point in using a bigint lib
  var addresses = getAddress(numbercount, 4) 
  var spaces = new Uint8Array(numbercount)

  var current_block = 1 // 0 is for constants, 2 is for buffer, 3 is for copy. then rotate
  var block = blocks[current_block]
  var address = addresses[current_block]
  var brk = 0
  var adrbrk = 0


  return {
    data: data
  , ads: address
  , alloc: alloc
  , cnst: cnst
  , free: free
  , reset: reset
  }

  function init(){

  }

  function alloc(length){
    var index = brk
    brk = length
    var pointer = adrbrk
    address[pointer] = index
    spaces[pointer] = index
    adrbrk++
    return 
  }

  function cnst(length){

  }

  function free(pointer){


  }

  function reset(){

  }
}

function print(n, pointer){

}
