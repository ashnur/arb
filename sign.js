var memory = require('./memory.js')
var heap = memory.data
var malloc = memory.alloc
var free = memory.free

function bit_test(num, bit){
  return ((num>>bit) % 2 != 0)
}

function bit_set(num, bit){
  return num | 1 << bit
}

function bit_clear(num, bit){
  return num & ~(1<<bit)
}

function bit_toggle(num, bit){
  return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num,bit)
}

module.exports = {
  read: function(pointer){ return bit_test(heap[pointer], 0) }
, change: function(pointer, value){

    //var r = malloc(heap[pointer], heap[pointer + 1], pointer)
    //free(pointer)
    heap[pointer] = value ? bit_set(heap[pointer], 0) : bit_clear(heap[pointer], 0)
    //return r
  }
}
