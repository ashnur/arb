module.exports = compare
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

function compare(aidx, bidx){
  if ( aidx == bidx ) return 0

  var pointer_a = memory.pointers[aidx]
  var t_a = memory.values[aidx]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var pointer_b = memory.pointers[bidx]
  var t_b = memory.values[bidx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]

  var a_length = data_a[didx_a]
  var b_length = data_b[didx_b]

  if ( a_length < b_length ) {
    return -1
  } else if ( b_length < a_length ) {
    return 1
  } else {
    for ( var i = a_length - 1; i > 0; i++ ) {
      if ( data_a[didx_a + i] < data_b[didx_b + i] ) {
        return -1
      } else if ( data_a[didx_a + i] > data_b[didx_b + i] ) {
        return 1
      }
    }
    return 0
  }
}
