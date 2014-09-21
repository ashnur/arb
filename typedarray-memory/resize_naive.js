module.exports = resize

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var log2 = log(2)

var d = require('../debug.js')

function resize(ads, next, data, l, brk){
  // console.log('------------------------------------- resize naive', (new Error).stack.match(/([\w\.]+:\d+:\d+)/g)[4])
  var new_ads = new ads.constructor(ads.length)
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / log2))
  var r = new data.constructor(length)
  var ri = 1
  for ( var i = 1; i < next; i++ ) {
    var data_idx = ads[i]
    if ( data_idx != 0 ) {
      var size = data[data_idx]
      new_ads[i] = ri
      for ( var j = 0; j < size; j++ ) {
        r[ri] = data[data_idx + j]
        ri++
      }
    }
  }
  //for ( var i = next; i < ads.length; i++ ) { ads[i] = 0 }
  return { data: r, brk: ri, ads: new_ads }


}


