void function(){
  var pool = require('./pool.js')
  module.exports = function right_shift(integer, n){
    var words = Math.floor(n / 16)
    var bits = n % 16
    var size = integer[1] - words
    var shifted = pool('integer', size)
    for ( var i = 2; i < shifted.length; i++ ) {
      shifted[i] = ((( integer[i + 1 + words] | 0) * 65536) + integer[i + words]) >>> bits
    }
    return shifted
  }
}()
