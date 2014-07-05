module.exports = to_base10
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
// internal-10 is do divmods repeatedly; each mod is a digit from right to left, until there's nothing left
var divide = require('./integer_division.js')
var compare = require('./integer_compare_abs.js')
var to_int = require('./primitive_to_int.js')
var ten = to_int(10000)

function to_base10(bigint){
  var dec = []
  while( compare(bigint, ten) >= 0 ) {
    var r = divide(bigint, ten)
    var rem = ads[r[1]]
    var digit = data[rem] > 0 ? data[ads[rem]] + '' : ''
    dec.push(Array(5 - digit.length).join('0') + digit)
    bigint = r[0]
  }
  digit = data[ads[bigint]] > 0 ? data[ads[ads[bigint]]] + '' : ''
  dec.push(digit)
  return dec.reverse().join('')
}
