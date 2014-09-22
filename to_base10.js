module.exports = to_base10
var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var numbers = memory.numbers
var temp = memory.temp

// internal-10 is do divmods repeatedly; each mod is a digit from right to left, until there's nothing left
var divide = require('./integer_division.js')
var compare = require('./integer_compare_abs.js')
var to_int = require('./primitive_to_int.js')
var ten = to_int(10000)

var print = require('./print.js')

function to_base10(bigint){
  var dec = []
  print('bigint', bigint)
  while( compare(bigint, ten) >= 0 ) {
    var r = divide(bigint, ten, temp)
    var rem_idx = r[1]

    var t_r = memory.values[rem_idx]
    var data_r = t_r.data
    var didx_r = t_r.ads[memory.pointers[rem_idx]]

    var digit = data_r[didx_r] > 2 ? data_r[didx_r + 2] + '' : ''

    dec.push(Array(5 - digit.length).join('0') + digit)
    bigint = r[0]
  }
  var t_b = memory.values[bigint]
  var data_b = t_b.data
  var didx_b = t_b.ads[memory.pointers[bigint]]

  digit = data_b[didx_b] > 2 ? data_b[didx_b + 2] + '' : ''
  dec.push(digit)
  return dec.reverse().join('')
}
