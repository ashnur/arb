module.exports = right_trim
var memory = require('./memory.js')
var ads = memory.ads
var data = memory.data
var free = memory.free
var type = require('./type.js')
var print = require('./print.js')
var zero = require('./zero.js')

function right_trim(pointer){
  var size_idx = ads[pointer]
  if ( data[size_idx] == 0 ) {
    return pointer
  }
  var idx = ads[size_idx]
  var last_non_zero = idx
  var zc = 0
  while ( idx !== 0 ) {
    if ( data[idx] != 0 ) {
      last_non_zero = idx
      zc = 0
    } else {
      zc += 1
    }
    idx = ads[idx]
  }
  if ( zc > 0 ) {
    data[size_idx] -= zc
    free(ads[last_non_zero])
    ads[last_non_zero] = 0
  }
  return pointer
}
