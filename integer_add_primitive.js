void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')
  var zero = require('./zero.js')
  var right_trim = require('./integer_right_trim.js')
  var equal = require('./integer_equality.js')
  var to_int = require('./primitive_to_int.js')
  var left_pad = require('./left_pad.js')
  var max = Math.max
  var log10 = Math.log
  var floor = Math.floor

  function add_number(A, num, idx){
    idx = idx || 0
    if ( num == 0 ) return A
    if ( equal(A, zero) ) return left_pad(to_int(num), idx)
    var R_size = max(A[1], 1 + floor(log10(num) / log10(65536))) + 1 + idx
    var R = pool(type('integer'), R_size)
    for ( var i = 2; i < idx + 2; i++ ) {
      R[i] = (A[i] | 0)
    }
    for ( var i = 2 + idx; i < R.length; i++ ) {
      num = (A[i] | 0) + num
      R[i] = num
      if ( num > 0 ) num = floor(num / 65536)
      //if ( num == 0 ) break
    }
    return right_trim(R)

  }

  module.exports = add_number
}()
