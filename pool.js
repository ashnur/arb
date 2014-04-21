void function(){
  "use strict"
  var pool = require('./pool_mem.js')
  var uint16 = pool.mallocUint16
  var free16 = pool.freeUint16
  var uint32 = pool.mallocUint32
  var free32 = pool.freeUint32

  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var slice = liberate(Array.prototype.slice)
  var reverse = liberate(Array.prototype.reverse)

  var create = function create(type, size, value){
    if ( typeof type == 'string' ) throw 'need bits here'
    var length = size + 2
    var arr = uint16(length)
    arr[0] = type
    arr[1] = length - 2
    for ( var i = 2; i < length; i++ ) {
      arr[i] = value && value[i] | 0
    }
    return arr
  }

  create.free = free16
  create.uint32 = uint32
  create.freeUint32 = free32

  module.exports = create

}()
