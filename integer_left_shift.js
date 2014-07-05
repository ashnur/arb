module.exports = left_shift
var memory = require('./memory.js')
var right_trim = require('./integer_right_trim.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var type = require('./type.js')
var left_pad = require('./left_pad.js')
var print = require('./print.js')
var one = require('./one.js')
var zero = require('./zero.js')
var equal = require('./integer_equality.js')
var clone = require('./clone.js')
function left_shift(integer, n){
  if ( equal(integer, zero) ) return zero
  var words = Math.floor(n / 16)
  var bits = n % 16
  var bats = 16 - bits
  var sidx = ads[integer]

  // var size = Math.ceil((n + all_bits) / 16)
  var size = data[sidx] + 1
  if ( bits ) {
    var shifted = alloc(size + 2)
    data[shifted] = 0 // type integer
    var ridx = ads[shifted]
    data[ridx] = size

    var carry = 0
    do {
      sidx = ads[sidx]
      ridx = ads[ridx]
      data[ridx] = carry + (data[sidx] << bits)
      carry = data[sidx] >>> bats
    } while ( sidx != 0 )

  } else {
    var shifted = clone(integer)
  }

  var wrd = right_trim(left_pad(shifted, words))
  return words ? wrd : right_trim(shifted)

}
