module.exports = Address
var i =0
function Address(max, length){
  if ( (max) <= 256 ) {
    return address = new Uint8Array(length)
  } else if ( (max) < Math.pow(2, 16) ) {
    return address = new Uint16Array(length)
  } else if ( (max) < Math.pow(2, 25) ) {
    return address = new Uint32Array(length)
  } else if ( max >= Math.pow(2, 25) ) {
    https://github.com/joyent/node/blob/857975d5e7e0d7bf38577db0478d9e5ede79922e/src/smalloc.h#L43
    throw new Error('Maximum size is 2^25 - 1. You gave: '+ max)
  }
}
