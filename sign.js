void function(){
  'use strict'
  var clone = require('./clone.js')
  function bit_test(num, bit){
    return ((num>>bit) % 2 != 0)
  }

  function bit_set(num, bit){
    return num | 1 << bit
  }

  function bit_clear(num, bit){
    return num & ~(1<<bit)
  }

  function bit_toggle(num, bit){
    return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num,bit)
  }

  module.exports = {
    read: function(number){
      return bit_test(number[0], 0)
    }
  , change: function(number, value){

      var r = clone(number)
      r[0] = value ? bit_set(r[0], 0) : bit_clear(r[0], 0)

      return r
    }
  }

}()
