
var memory = require('./typedarray-memory')

var numbers
var constants
var temp

var n
var pointers
var values
var heap

init()

module.exports = heap

function init(){
  numbers = memory.numbers(Uint16Array, 2 , false)
  constants = memory.constants(Uint16Array, 4, false)
  temp = memory.temp(Uint16Array, 1024, false)
  n = 0
  pointers = [] // this can be a typedarray
  values = [] // this no, because has to store the object references
  heap = { numbers: factory(numbers)
         , constants: factory(constants)
         , temp: factory(temp)
         , values: values
         , pointers: pointers
         , reset: reset }
}



function reset(){
//  init()
}

function factory(t){
  return function(size){
    var pointer = t.alloc(size)
    var didx = t.ads[pointer]
    t.data[didx] = size
    pointers[n] = pointer
    values[n] = t
    return n++
  }
}

