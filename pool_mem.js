"use strict"

if(!global.__TYPEDARRAY_POOL) {
  global.__TYPEDARRAY_POOL = {
    UINT16  : []
  , UINT32  : []
  }
}
var POOL = global.__TYPEDARRAY_POOL
var UINT16  = POOL.UINT16
var UINT32  = POOL.UINT32

exports.free = function free(array) {
  if ( ! UINT16[n] ) UINT16[n] = []
  UINT16[n].push(array)
}

exports.freeUint16 = function freeUint16(array) {
  if ( ! UINT16[array.length] ) UINT16[array.length] = []
  UINT16[array.length].push(array)
}
exports.freeUint32 = function freeUint32(array) {
  if ( ! UINT32[array.length] ) UINT32[array.length] = []
  UINT32[array.length].push(array)
}

exports.mallocUint16 = function mallocUint16(n) {
  var cache = UINT16[n]
  if( cache && cache.length > 0) {
    return cache.pop()
  }
  return new Uint16Array(n)
}

exports.mallocUint32 = function mallocUint32(n) {
  var cache = UINT32[n]
  if( cache && cache.length > 0) {
    return cache.pop()
  }
  return new Uint32Array(n)
}

exports.clearCache = function clearCache() {
  var l = Math.max(UINT16.length, UINT32.length)
  for(var i=0; i < l; ++i) {
   if ( UINT16 [i] ) UINT16[i].length = 0
   if ( UINT32 [i] ) UINT32[i].length = 0
  }
}
