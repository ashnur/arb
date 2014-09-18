module.exports = Address

function Address(max, length){
  if ( (max) <= 256 ) {
    return address = new Uint8Array(length)
  } else if ( (max) < Math.pow(2, 16) ) {
    return address = new Uint16Array(length)
  } else if ( (max) < Math.pow(2, 32) ) {
    return address = new Uint32Array(length)
  } else if ( max >= Math.pow(2, 32) ) {
    throw new Error('Maximum size is 2^32 - 1. You gave: '+ max)
  }
}
