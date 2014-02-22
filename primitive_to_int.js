void function(){
  var pool = require('./pool.js')
  var floor = Math.floor
  var log10 = Math.log
  module.exports = function to_int(num){
    if ( num == 0 ) return require('./zero.js')
    if ( num == 1 ) return require('./one.js')
    var R_size = 1 + floor(log10(num) / log10(65536))
    var R = pool('integer', R_size)
    var i = 2
    while ( num > 0 ) {
      R[i] = num
      num = floor(num / 65536)
      i += 1
    }
    return R
  }
}()
