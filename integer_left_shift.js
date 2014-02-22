void function(){
  var pool = require('./pool.js')
  var leading = require('./integer_bits.js').leading
  module.exports = function left_shift(integer, n){
    var words = Math.floor(n / 16)
    var bits = n % 16

    var il = integer.length - 1
    var all_bits = integer[1] == 0 ? 0
                 :                   integer[il].toString(2).length + (16 * (il - 2))

    var size = Math.ceil((n + all_bits) / 16)
    var shifted = pool('integer', size)
    for ( var i = shifted.length - 1; i > 1; i-- ) {
      var idx = i - words
      shifted[i] = (idx - 1 > 1 ? (integer[idx - 1] >>> (16 - bits)) : 0 ) + ( (idx > 1 ? integer[idx] : 0) <<  bits )
    }
    return shifted
  }
}()
