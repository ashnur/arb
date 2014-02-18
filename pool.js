void function(){
  var pool = require('./pool_mem.js')
  var type = require('./type.js')
  var sign = require('./sign.js')
  var uint16 = pool.mallocUint16
  var free16 = pool.freeUint16
  var uint32 = pool.mallocUint32
  var free32 = pool.freeUint32

  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var slice = liberate(Array.prototype.slice)
  var reverse = liberate(Array.prototype.reverse)

  function toString(){
    return this[1] ? (sign.read(this)?'-':'+') + join(slice(this,2), '|') : '0'
  }

  function create(t, size, value){
    var length = size + 2
    var arr = uint16(length)
    arr.toString = toString
    arr[0] = type(t)
    arr[1] = length - 2
    for ( var i = 2; i < length; i++ ) {
      arr[i] = value && value[i] | 0
    }
    return arr
  }
  module.exports = create
  module.exports.free = free16
  module.exports.uint32 = uint32
  module.exports.freeUint32 = free32

}()
