module.exports = add_number
var zero = require('./zero.js')
var equal = require('./integer_equality.js')
var to_int = require('./primitive_to_int.js')
var left_pad = require('./left_pad.js')
var print = require('./print.js')
var add = require('./integer_addition.js')
var clone = require('./clone.js')

function add_number(A, num, idx){
  idx = idx || 0
  if ( num == 0 ) return clone(A)
  if ( equal(A, zero) ) return left_pad(to_int(num), idx)
  var tointnum = to_int(num)
  var leftpadnum = left_pad(tointnum, idx)
  var p =  add(A, leftpadnum)
  return p
}
