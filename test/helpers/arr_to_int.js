module.exports = arr_to_int
var memory = require('../../memory.js')
var pointers = memory.pointers
var values = memory.values
var temp = memory.temp

function arr_to_int(arr){
  var I_idx = temp(arr.length + 2)
  var pointer_i = pointers[I_idx]
  var t_i = values[I_idx]
  var data_i = t_i.data
  var didx_i = t_i.ads[pointer_i]
  data_i[didx_i + 1] = 0 // type integer
  for( var i = 2, j = 0; j < arr.length; i++, j++ ) {
    data_i[didx_i + i] = arr[j]
  }
  return I_idx
}
