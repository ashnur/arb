void function(){
  var pool = require('./pool.js')
  var zero = require('./zero.js')
  function right_trim(arr){
    if ( arr.length == 2 ) {
      return arr
    }
    var arr_length = arr.length
    var zc = 0
    var i = arr_length - 1
    while ( arr[i] == 0 ) {
      zc += 1
      i -= 1
    }
    if ( zc > 0 ) {

      var arr_shrink = pool('integer', arr_length - zc - 2)
      var ls = arr_shrink.length
      arr_shrink[1] = arr[1] - zc

      for ( i = 2; i < ls; i++ ) {
        arr_shrink[i] = arr[i]
      }
      pool.free(arr)
      return arr_shrink
    }
    return arr
  }

  module.exports = right_trim
}()
