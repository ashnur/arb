void function(){
  'use strict'
  var types = {
    integer: 0 // 0
  , rational: 2 // 10
  , polyinteger: 14 //1110
  , polyrational: 30 //11110
  }

  module.exports = function(type){
    return types[type] || types['integer']
  }

}()
