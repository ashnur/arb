void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')

  module.exports = function left_pad(A, by){
    var R = pool(type('integer'), A[1] + by)
    var i = 2 + by, l = R.length
    for ( ; i < l; i++ ) {
      R[i] = A[i - by]
    }
    return R
  }

}()
