void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')
  module.exports = function right_shift(integer, n){
    var words = Math.floor(n / 16)
    var bits = n % 16
    var size = integer[1] - words
    var shifted = pool(type('integer'), size)
    for ( var i = 2; i < shifted.length; i++ ) {
      var idx1 = i + 1 + words
      var idx0 = i + words
      var up = idx1 >= 2 ? integer[idx1] | 0 : 0
      var down = idx0 >= 2 ? integer[idx0] : 0
      shifted[i] = (up * 65536 + down ) >>> bits
    }
    return shifted
  }
}()
