module.exports = equal
var memory = require('./memory.js')
var print = require('./print.js')
var data = memory.data
var ads = memory.ads
var max = Math.max
function equal(a, b, debug){
  if ( a === b ) return true
  if ( data[a] !== data[b] ) return false
  var aidx = ads[a]
  var bidx = ads[b]
  while ( aidx != 0 ) {
    if ( data[aidx] != data[bidx] ) return false
    aidx = ads[aidx]
    bidx = ads[bidx]
  }
  return true
}
