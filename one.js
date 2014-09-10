var memory = require('./memory.js')
var one_idx = memory.constants(3)
var t = memory.values[one_idx]
var pointer = memory.pointers[one_idx]
var didx = t.ads[pointer]
t.data[didx + 1] = 0 // type integer
t.data[didx + 2] = 1 // value
module.exports = one_idx
