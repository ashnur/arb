module.exports = compare
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
function compare(a, b){
  if ( a == b ) return 0
  var aidx = ads[a]
  var bidx = ads[b]
  var a_length = data[aidx]
  var b_length = data[bidx]
  if ( a_length < b_length ) {
    return -1
  } else if ( b_length < a_length ) {
    return 1
  } else {
    var as = []
    var bs = []
    while ( aidx != 0 ) {
      as.push(data[aidx])
      bs.push(data[bidx])
      aidx = ads[aidx]
      bidx = ads[bidx]
    }
    for ( var i = as.length - 1 ; i >= 0 ; i-- ) {
      if ( as[i] < bs[i] ) {
        return -1
      } else if ( bs[i] < as[i] ) {
        return 1
      }
    }
    return 0
  }
}
