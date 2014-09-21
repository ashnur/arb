module.exports = add_number
var memory = require('./memory.js')
var free = memory.free
var zero = require('./zero.js')
var equal = require('./integer_equality.js')
var to_int = require('./primitive_to_int.js')
var left_pad = require('./left_pad.js')
var add = require('./integer_addition.js')

function add_number(A, num, idx){
  idx = idx || 0
  if ( num == 0 ) return A
  var tointnum = to_int(num)
  if ( equal(A, zero) )  {
    if ( idx == 0 ) {
      return tointnum
    } else {
      var leftpadnum = left_pad(tointnum, idx)
      free(tointnum)
      return leftpadnum
    }
  } else {
    if ( idx == 0 ) {
      var p = add(A, tointnum)
      free(tointnum)
      return p
    } else {
      var leftpadnum = left_pad(tointnum, idx)
      var p = add(A, leftpadnum)
      free(tointnum)
      free(leftpadnum)
      return p
    }
  }

  return p
}
