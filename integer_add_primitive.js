void function(){
  var pool = require('./pool.js')
  var zero = require('./zero.js')()
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
    var R = pool('integer', R_size)
    var r = 0
    var R_length = R_size + 2
    for ( var i = 2; i < idx + 2; i++ ) { R[i] = (A[i] | 0) }
    for ( var i = 2 + idx; i < R_length; i++ ) {
      num = (A[i] | 0) + num
      R[i] = num
      if ( num > 0 ) num = floor(num / 65536)
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
      pool.free(R)
      return R_shrink
    }
    //if ( R[R_length - 1] == 0 ) {
    //  var R_shrink = pool('integer', R_size - 1)
    //  var ls = R_shrink.length
    //  R_shrink[1] = R[1] - 1
    //  for ( i = 2; i < ls; i++ ) { R_shrink[i] = R[i] }
    //  pool.free(R)
    //  return R_shrink
    //}

    return R

  }

  module.exports = add_number
}()
