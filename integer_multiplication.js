void function(){
  var pool = require('./pool.js')
  var right_trim = require('./integer_right_trim.js')
  var one = require('./one.js')
  var zero = require('./zero.js')
  var equal = require('./integer_equality.js')
  var add = require('./integer_addition.js')
  var addp = require('./integer_add_primitive.js')

  module.exports = function(A, B){
    if ( equal(A, zero) ) return zero
    if ( equal(B, zero) ) return zero
    if ( equal(A, one) ) return B
    if ( equal(B, one) ) return A
    var A_size = A[1]
    var B_size = B[1]
    var R_size = A_size + B_size
    var R = pool('integer', R_size)
    //var T = pool.uint32(T_size)
    var a_length = A_size + 2
    var b_length = B_size + 2
    var r = 0
    for ( var i = 2; i < a_length ; i++ ) {
      a = A[i]
      for ( var j = 2; j < b_length ; j++ ) {
        b = B[j]
        r = a * b
        R = addp(R, r, i+j-4)
      }
    }
    return right_trim(R)
  }
}()
