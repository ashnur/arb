void function(){
  module.exports = function(a, b){
    for ( var i = 0; i < a.length; i++ ) {
      if ( a[i] !== b[i] ) return false
    }
    return true
  }
}()
