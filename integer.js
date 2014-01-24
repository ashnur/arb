void function(){
  'use strict'

  var pool = require('typedarray-pool')


  function parse(hash_string){
    var hash_array = hash_string[0] == '-'  ? [-1, hash_string.slice(1)]
                   : hash_string[0] == '+'  ? [1 , hash_string.slice(1)]
                   : /* otherwise */          [1 , hash_string.slice(0)]

    var sign = hash_array[0]
    var hash = hash_array[1]
    var chunks = []

    var length = hash.length
    var carry = 0



  }

  module.exports = function(hash_string){
    return cache[hash_string] || cache[hash_string] = parse(hash_string)
  }

}()
