void function(){
  // internal-10 is do divmods repeatedly; each mod is a digit from right to left, until there's nothing left
  var divide = require('./integer_division.js')
  var compare = require('./integer_compare_abs.js')
  var to_int = require('./primitive_to_int.js')
  var ten = to_int(10000)

  function to_base10(bigint){
    var dec = []
    while( compare(bigint, ten) >= 0 ) {
      var r = divide(bigint, ten)
      var digit = r[1][2] ? r[1][2] + '' : ''
      dec.push(Array(5 - digit.length).join('0') + digit)
      bigint = r[0]
    }
    digit = bigint[2] ? bigint[2] + '' : ''
    dec.push(digit)
    return dec.reverse().join('')
  }
  module.exports = to_base10
}()
