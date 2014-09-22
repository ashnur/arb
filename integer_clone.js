module.exports = clone
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

function clone(idx, storage){
  storage = storage || numbers

  var t = values[idx]
  var data = t.data
  var didx = t.ads[pointers[idx]]
  var size = data[didx]

  var cidx = storage(size)
  var ct = values[cidx]
  var cdata = ct.data
  var cdidx = ct.ads[pointers[cidx]]

  for ( var i = 1; i < size; i++ ) {
    cdata[cdidx + i] = data[didx + i]
  }

  return cidx
}
