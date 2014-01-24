void function(){
  module.exports = function(a, b){
    var l = a.length
    for ( var i = 0; i < l; i++ ) {
      if ( a[i] !== b[i] ) return false
    }
    return true
  }
}()
