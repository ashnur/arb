void function(){
  'use strict'
  var types = {
    integer: 0
  , rational: 2
  , polyinteger: 14
  , polyrational: 30
  }

  module.exports = function(type){
    return types[type] || 0
  }

}()
