module.exports = clone
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

function clone(idx){
  var pointer = memory.pointers[idx]
  var t = memory.values[idx]
  var data = t.data
  var didx = t.ads[pointer]
  var size = data[didx]

  var cidx = memory.numbers(size)
  var cp = memory.pointers[cidx]
  var ct = memory.values[idx]
  var cdata = ct.data
  var cdidx = ct.ads[cp]

  for ( var i = 1; i < size; i++ ) {
    cdata[cdidx + i] = data[didx + i]
  }

  return cidx
}
