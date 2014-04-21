void function(){
  "use strict"
  var pool = require('./pool.js')
  function clone(tarr){
    return pool(tarr[0], tarr[1], tarr)
  }
  module.exports = clone
}()
