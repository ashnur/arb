var memory = require('./memory.js')
var zero_idx = memory.constants(2)
var t = memory.values[zero_idx]
var pointer = memory.pointers[zero_idx]
var didx = t.ads[pointer]
t.data[didx + 1] = 0 // type integer
module.exports = zero_idx
