module.exports = Memory

function Memory(size, silent){

  var cnstbrk = 1
  var cnstlast = cnstsize
  var cnstua = cnstsize
  if ( cnstsize ) {
    for ( var i = 1; i < cnstsize ; i ++ ) {
      address[i] = i + 1
    }
    address[cnstsize] = 0
  }

  function cnst(length){
    if ( length > cnstua ) throw new Error('run out of memory')
    cnstua -= length
    var pointer = cnstbrk
    var end = pointer
    while ( --length > 0 && end ) {
      var end = address[end]
    }
    cnstbrk = cnstua ? address[end] : 0
    if ( ! cnstbrk) {
      last = 0
    }
    address[end] = 0
    return pointer
  }

}
