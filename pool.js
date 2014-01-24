void function(){
  var pool = require('./pool_mem.js')
  var type = require('./type.js')
  var uint16 = pool.mallocUint16
  var free16 = pool.freeUint16
  var uint32 = pool.mallocUint32
  var free32 = pool.freeUint32

  module.exports = function(t, size){
    var length = size + 2
    var arr = uint16(length)
    arr[0] = type(t)
    arr[1] = length - 2
    for ( var i = 2; i < length; i++ ) {
      arr[i] = 0
    }
    return arr
  }

  module.exports.free = free16
  module.exports.uint32 = uint32
  module.exports.freeUint32 = free32

}()
