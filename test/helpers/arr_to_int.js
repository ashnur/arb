module.exports = arr_to_int
var memory = require('../../memory.js')
var pointers = memory.pointers
var values = memory.values
var temp = memory.temp
var print = require('../../print.js')

function arr_to_int(arr, all){
  all = all || false

  var I_idx = temp( all ? arr[0] : arr.length + 2 )
  var t_i = values[I_idx]
  var data_i = t_i.data
  var didx_i = t_i.ads[pointers[I_idx]]
  data_i[didx_i + 1] = all ? arr[1] : 0
  for( var i = 2, j = all ? 2 : 0; j < arr.length; i++, j++ ) {
    data_i[didx_i + i] = arr[j]
  }
  print('i', I_idx)
  return I_idx
}
