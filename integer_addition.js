void function(){
  var pool = require('./pool.js')
  var zero = require('./zero.js')()
  var equal = require('./integer_equality.js')

 function add(A, B){
    if ( equal(A, zero) ) return B
    if ( equal(B, zero) ) return A
    var A_size = A[1]
    var B_size = B[1]
    var R_size = Math.max(A_size, B_size) + 1
    var R = pool('integer', R_size)
    var carry = 0
    var r = 0
    var R_length = R_size + 2
    for ( var i = 2; i < R_length; i++ ) {
      r = (A[i] | 0) + (B[i] | 0) + carry
      R[i] = r
      carry =  r > 65535 ? 1 : 0
    }
    if ( carry ) R[i] = R[i] + 1
    if ( R[R_length - 1] == 0 ) {
//      R[1] = R[1] - 1 // equal should be changed for this to work
      var R_shrink = pool('integer', R_size - 1)
      var ls = R_shrink.length
      R_shrink[1] = R[1] - 1

      for ( i = 2; i < ls; i++ ) {
        R_shrink[i] = R[i]
      }
      pool.free(R)
      return R_shrink

    }
    return R
  }

  module.exports = add
}()
