module.exports = get_new_zero
var memory = require('./memory.js')
function get_new_zero(){
  var zero = memory.numbers(2)
  var pointer = memory.pointers[zero]
  var t = memory.values[zero]

  var didx = t.ads[pointer]
if ( t.data[didx] !== 2 ) console.log('get new zero size is not 2' , t.data[didx] )

  t.data[didx + 1] = 0 // type integer

  return zero
}
