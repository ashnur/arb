void function(){
  var pool = require('./pool.js')
  var compare = require('./integer_compare_abs.js')

  function is_pow2(n){
    return n && !(n & (n - 1))
  }
  module.exports = function(A, B){
    var comp = compare(A, B)
    if ( comp == 0 ) {
      var ZERO = pool('integer',0)
      return ZERO
    } else if ( comp > 0 ) {
      var T = B
      B = A
      A = T
    }
    var A_size = A[1]
    var B_size = B[1]
    var R_size = B_size

    var R = pool('integer', R_size)
    var carry = 0
    var r = 0

    var R_length = R_size + 2
    for ( var i = 2, l = R_length ; i < l ; i++) {
      r = (B[i] | 0) - (A[i] | 0) + carry
      if ( r < 0 ) {
        R[i] = r + 65536
        carry = -1
      } else {
        R[i] = r
        carry = 0
      }
    }

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
