module.exports = Memory
var rand = Math.random
function getPool(type, length, size){
  var pool = Array(size)
  while ( size-- > 0 ){
    pool.push(new type(length))
  }
  return pool
}

function Memory(type, size, cnstsize, silent){
  silent = silent || true
  cnstsize = cnstsize || 0
  var length = size + cnstsize + 1

  // have a pool of memory blocks
  var blocks = getPool(type, length, 4)

  var brk
  var last
  var unallocated = size

  var cnstbrk = 1
  var cnstlast = cnstsize
  var cnstua = cnstsize
  if ( cnstsize ) {
    for ( var i = 1; i < cnstsize ; i ++ ) {
      address[i] = i + 1
    }
    address[cnstsize] = 0
  }

  var ff = []
  var poss_free = 0

  init()

  return {
    data: data
  , ads: address
  , alloc: alloc
  , cnst: cnst
  , free: free
  , reset: reset
  , brk: function(){ return brk}
  , lst: function(){ return last}
  , unalloc: function(){ return unallocated}
  }

  function init(){

  }

  function alloc(length){

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
