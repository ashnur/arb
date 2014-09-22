module.exports = parse

var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var temp = memory.temp
var numbers = memory.numbers

var add = require('./integer_addition.js')
var multiply = require('./integer_multiplication.js')
var zero = require('./zero.js')
var one = require('./one.js')
var to_int = require('./primitive_to_int.js')
var ten = to_int(10000)

var pot = [one, ten]

var print = require('./print.js')

function power_of_ten(i){
  if ( pot[i] != null ) return pot[i]
  for ( var k = pot.length; k <= i; k++ ) {
    pot[k] = multiply(pot[k - 1], ten, temp)
  }
  return pot[i]
}

function parse(str, storage){
  var r = zero
  var i = 0
  while ( str.length ) {
    r = i == 0 ? to_int(Number(str.slice(-4)), temp)
      :          add(r, multiply(to_int(Number(str.slice(-4)), temp), power_of_ten(i), temp), temp)
    str = str.slice(0, -4)
    i++
  }
  if ( storage == numbers ) {
    var pointer_r = pointers[r]
    var t_r = values[r]

    var size_r = t_r.data[t_r.ads[pointer_r]]

    var R_idx = storage(size_r)

    var pointer_R = pointers[R_idx]
    var t_R = values[R_idx]
    data_R = t_R.data
    didx_R = t_R.ads[pointer_R]

    data_r = t_r.data
    didx_r = t_r.ads[pointer_r]

    for ( var l = 0; l < size_r; l++ ) {
      data_R[didx_R + l] = data_r[didx_r + l]
    }

    memory.stacks.free(pointer_r)
    return R_idx
  }
  return r
}
