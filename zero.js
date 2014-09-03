var memory = require('./memory.js')

var zero = memory.constants(2)
var type = memory.values[zero]
console.log(zero)
var pointer = memory.pointers[zero]
var didx = type.ads[pointer]
type.data[didx + 1] = 0 // type integer
module.exports = zero
