module.exports = left_pad
var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var numbers = memory.numbers
var temp = memory.temp

var print = require('./print.js')

function left_pad(A_idx, by, storage){
  storage = storage || temp

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]
  var size_a = t_a.data[t_a.ads[pointer_a]]

  var R_idx = storage(size_a + by)

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]
  data_r[didx_r + 1] = 0 // type integer

  for ( var i = 2; i < by + 2; i++ ) {
    data_r[didx_r + i] = 0
  }
  for ( var i = 2; i < size_a; i++ ) {
    data_r[didx_r + by + i] = data_a[didx_a + i]
  }

  return R_idx
}
