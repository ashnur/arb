void function(){
  var pool = require('./pool.js')
  var compare = require('./integer_compare.js')

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

    for ( var i = 2, l = R.length ; i < l ; i++) {
      r = (B[i] | 0) - (A[i] | 0) + carry
      if ( r < 0 ) {
        R[i] = r + 65536
        carry = -1
      } else {
        R[i] = r
        carry = 0
      }
    }
    return R
  }

}()
