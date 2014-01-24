void function(){
  var pool = require('./pool.js')
  var one = require('./one.js')()
  var zero = require('./zero.js')()
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
    var R_length = R.length
    var zc = 0
    var i = R_length - 1
    while ( R[i] == 0 ) {
      zc += 1
      i -= 1
    }
    if ( zc > 0 ) {
      var R_shrink = pool('integer', R_length - zc - 2)
      var ls = R_shrink.length
      R_shrink[1] = R[1] - zc

      for ( i = 2; i < ls; i++ ) {
        R_shrink[i] = R[i]
      }
      return R_shrink

    }
    return R
  }
}()
