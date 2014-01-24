void function(){
  'use strict'
  var BitArray = require('bit-array')
  module.exports = {
    read: function(number){
      var data = new BitArray(16, number[0].toString(16))
      return data.get(0)
    }
  , change: function(number, value){
      var data = new BitArray(16, number[0].toString(16))
      data.set(0, value)
      number[0] = parseInt(data.toHexString(), 16)
//      var test = new BitArray(16, parseInt(number[0], 16)+'')
//      console.log('sign', (test.get(0) ==  !!value), data.toString(), test.toString())
      return number
    }
  }

}()
