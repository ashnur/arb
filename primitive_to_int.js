module.exports = to_int
var memory = require('./memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var floor = Math.floor
var log10 = Math.log
var zero = require('./zero.js')
var one = require('./one.js')
var print = require('./print.js')
function to_int(num){
  if ( num == 0 ) return zero
  if ( num == 1 ) return one
  var R_size = 1 + floor(log10(num) / log10(65536))
  var R = alloc(R_size + 2)
  data[R] = 0 // type integer

  var idx = ads[R]
  data[idx] = R_size

  while ( num > 0 ) {
    idx = ads[idx]
    data[idx] = num
    num = floor(num / 65536)
  }
  return R
}
