var memory = require('./typedarray-memory/index.js')

var numbers = memory.numbers(Uint16Array, 1 , false)
var constants = memory.constants(Uint16Array, 4, false)
var temp = memory.temp(Uint16Array, 128, false)
var n = 0
var pointers = [] // this can be a typedarray
var values = [] // this no, because has to store the object references

module.exports = { naives: numbers
                 , consts: constants
                 , stacks: temp

                 , numbers: factory(numbers)
                 , constants: factory(constants)
                 , temp: factory(temp)

                 , values: values
                 , pointers: pointers
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


