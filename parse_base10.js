module.exports = parse

var memory = require('./memory.js')
var data = memory.data
var alloc = memory.alloc
var ads = memory.ads
var free = memory.free
var add = require('./integer_addition.js')
var multiply = require('./integer_multiplication.js')
var zero = require('./zero.js')
var one = require('./one.js')
var to_int = require('./primitive_to_int.js')
var ten = to_int(10000)

var pot = [one, ten]
function power_of_ten(i){
  if ( pot[i] != null ) return pot[i]
  for ( var k = pot.length; k <= i; k++ ) {
    pot[k] = multiply(pot[k - 1], ten)
  }
  return pot[i]
}

function parse(str){
  var r = zero
  var i = 0
  while ( str.length ) {
    r = i == 0 ? to_int(Number(str.slice(-4)))
      :          add(r, multiply(to_int(Number(str.slice(-4))), power_of_ten(i)))
    str = str.slice(0, -4)
    i++
  }
  return r
}
