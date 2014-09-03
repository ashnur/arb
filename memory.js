var memory = require('./typedarray-memory')

var numbers = memory.numbers(Uint16Array, 256 * 1024, false)
var constants = memory.constants(Uint16Array, 64, false)
var temp = memory.temp(Uint16Array, 1024, false)

var n = 0
var pointers = [] // this can be a typedarray
var values = [] // this no, because has to store the object references

var heap = { numbers: factory(numbers)
           , constants: factory(constants)
           , temp: factory(temp)
           , values: values
           , pointers: pointers }

function factory(t){
  return function(size){
    var pointer = t.alloc(size)
    var didx = t.ads[pointer]
    t.data[pointer] = size
    pointers[n] = pointer
    values[n] = t
    return n++
  }
}

module.exports = heap
