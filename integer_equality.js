module.exports = equal
var memory = require('./memory.js')
var pointers = memory.pointers
var values = memory.values
var max = Math.max
function equal(a, b){
  if ( a === b ) return true
  var pointer_a = pointers[a]
  var pointer_b = pointers[b]
  var t_a = values[a]
  var t_b = values[b]
  var data_a = t_a.data
  var data_b = t_b.data
  var didx_a = t_a.ads[pointer_a]
  var didx_b = t_b.ads[pointer_b]
  var size_a = t_a.data[didx_a]
  var size_b = t_b.data[didx_b]
  if ( size_a !== size_b ) return false
  for ( var i = 1; i < size_a; i++ ) {
    if ( data_a[didx_a + i] != data_b[didx_b + i] ) return false
  }
  return true
}
