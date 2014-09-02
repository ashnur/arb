module.exports = resize

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var log2 = log(2)

function resize(arr, l){
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / log2))
  var r = new arr.constructor(length)
  r.set(arr)
  return r
}


