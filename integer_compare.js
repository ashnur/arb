void function(){
  module.exports = function(a, b){
    var a_length = a.length
    var b_length = b.length
    if ( a_length < b_length ) {
      return -1
    } else if ( b_length < a_length ) {
      return 1
    } else {
      for ( ; a_length > 1; a_length-- ) {
        if ( a[a_length] < b[a_length] ) {
          return -1
        } else if ( b[a_length] < a[a_length] ) {
          return 1
        }
      }
      return 0
    }
  }
}()
