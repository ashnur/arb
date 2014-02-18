void function(){
  var pool = require('./pool.js')
  var pool_mem = require('./pool_mem.js')
  var zero = require('./zero.js')()
  var right_trim = require('./integer_right_trim.js')
  var equal = require('./integer_equality.js')
  var to_int = require('./primitive_to_int.js')
  var left_pad = require('./left_pad.js')
  var max = Math.max
  var log10 = Math.log
  var floor = Math.floor
  var add = require('./integer_addition.js')


  function multiply(A, num){

    var R_size = A[1] + Math.ceil(num / 65536)
    var R = pool('integer', R_size)
    //var R_length = R_size + 2
    var carry = 0
    for ( var i = 2; i < A.length; i++ ) {
      var t = A[i] * num + carry
      R[i] = t
      carry = t > 65535 ? 1 : 0 + carry
    }

    return right_trim(R)

  }

  function multiply_number(A, num){
    if ( num == 0 || equal(A, zero) ) return zero
    var rank = Math.floor(Math.log(num) / log10(65536))
    var ms = pool_mem.mallocUint16(rank + 1)
    for ( var i = 0; i <= rank; i++ ) {
      console.log(num)
      ms[i] = num % 1
    }
    return A
  }

  module.exports = multiply_number
}()
