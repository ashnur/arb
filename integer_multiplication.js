module.exports = multiply
var memory = require('./memory.js')
var data = memory.data
var alloc = memory.alloc
var ads = memory.ads
var free = memory.free
var type = require('./type.js')
var right_trim = require('./integer_right_trim.js')
var one = require('./one.js')
var zero = require('./zero.js')
var equal = require('./integer_equality.js')
var add = require('./integer_addition.js')
var addp = require('./integer_add_primitive.js')
var print = require('./print.js')
var clone = require('./clone.js')

function multiply(A, B){
  if ( equal(A, zero) ) return clone(zero)
  if ( equal(B, zero) ) return clone(zero)
  if ( equal(A, one) ) return clone(B)
  if ( equal(B, one) ) return clone(A)
  var aidx = ads[A]
  var bidx = ads[B]
  var A_size = data[aidx]
  var B_size = data[bidx]
  var R_size = A_size + B_size

  var r = 0
  var i = 0
  aidx = ads[aidx]
  bidx = ads[bidx]
  var R = zero
  var RR = 0
  while ( aidx != 0 ) {
    var a = data[aidx]
    var j = 0
    while ( bidx != 0 ) {
      var b = data[bidx]
      r = a * b
      var PP = RR || R
      var RR = addp(PP, r, i + j)
      if ( PP != 0 && PP != zero ) free(PP)
      bidx = ads[bidx]
      j ++
    }
    aidx = ads[aidx]
    bidx = ads[ads[B]]
    i ++
  }
  return right_trim(RR)
}
