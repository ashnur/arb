module.exports = get_new_zero
var memory = require('./memory.js')
var data = memory.data
var alloc = memory.alloc
var ads = memory.ads
function get_new_zero(){
  var zero = alloc(2)
  data[zero] = 0 // type integer
  var idx = ads[zero]
  data[idx] = 0 // size zero
  return zero
}
