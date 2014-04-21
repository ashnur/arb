void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')
  var floor = Math.floor
  var log10 = Math.log
  var zero = require('./zero.js')
  var one = require('./one.js')
  module.exports = function to_int(num){
    if ( num == 0 ) return zero
    if ( num == 1 ) return one
    var R_size = 1 + floor(log10(num) / log10(65536))
    var R = pool(type('integer'), R_size)
    var i = 2
    while ( num > 0 ) {
      R[i] = num
      num = floor(num / 65536)
      i += 1
    }
    return R
  }
}()
