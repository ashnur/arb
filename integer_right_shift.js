module.exports = right_shift
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var right_trim = require('./integer_right_trim.js')
function right_shift(integer, n){
  var words = Math.floor(n / 16)
  var bits = n % 16
  var bats = 16 - bits
  var iidx = ads[integer]
  var size = data[iidx] - words

  var shifted = alloc(size + 2)
  data[shifted] = 0 //type integer
  var sidx = ads[shifted]
  data[sidx] = size
  var skip = 0
  while ( iidx != 0 ) {
    iidx = ads[iidx]
    var nidx = ads[iidx]
    skip++
    if ( skip > words ) {
      sidx = ads[sidx]
      data[sidx] = (data[iidx] >>> bits) + (data[nidx] << bats)
    }
  }
  return right_trim(shifted)
}
