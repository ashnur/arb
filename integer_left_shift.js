void function(){
  var pool = require('./pool.js')
  var leading = require('./integer_bits.js').leading
  module.exports = function left_shift(integer, n){
    var words = Math.floor(n / 16)
    var bits = n % 16
    var diff =  Math.ceil((n - leading(integer))/16)
    var size = integer[1] + diff
    var shifted = pool('integer', size)
    for ( var i = shifted.length - 1; i > 2; i-- ) {
      var idx = i - words
      shifted[i] = (integer[idx - 1] >>> (16 - bits)) + ( (idx > 1 ? integer[idx] : 0) <<  bits )
    }
    return shifted
  }
}()
