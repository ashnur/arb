module.exports = resize

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var log2 = log(2)

function resize(ads, next, arr, l, brk){
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / log2))
  var r = new arr.constructor(length)
  var ri = 1
  var nc = 0
  for ( var i = 0; i < next; i++ ) {
    var data_idx = ads[i]
    if ( data_idx != 0 ) {
      var size = arr[data_idx]
      if ( arr[data_idx] > 15000 ) throw new Error( 'size fucked up')
      ads[i] = ri
      for ( var j = 0; j < size; j++ ) {
        r[ri++] = arr[data_idx + j]
      }
    }
  }
  return { data: r, brk: ri }
}


