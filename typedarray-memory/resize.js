module.exports = resize
var Address = require('./address.js')

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var log2 = log(2)

function resize(arr, l, maxvalue){
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / log2))
  var r = Address(maxvalue, length)
  r.set(arr)
  return r
}


