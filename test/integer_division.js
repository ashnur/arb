void function(){
  'use strict'
  var test = require('tape')
  var claire = require('claire')
  var rn = require('random-number')
  var pool = require('typedarray-pool')
  var type = require('../type.js')
  var sign = require('../sign.js')
  var bigint = require('biginteger')
  var div = require('../integer_division.js')

  var for_all = claire.forAll
  var as_generator = claire.asGenerator

  var rand_bool = rn.bind(null, {integer:true})
  var rand_small_nat = rn.bind(null, {min: 1, max: 10, integer:true})
  var rand_large = rn.bind(null, {min: 0, max:65536, integer:true})
  var rand_large_nat = rn.bind(null, {min: 1, max:65536, integer:true})

  function random_int(size){
    var length = rand_small_nat() + 2
    var arr = pool.mallocUin16(length)
    arr[0] = type('integer')
    sign.change(arr, rand_pool())
    arr[1] = length - 2
    arr[2] = rand_large_nat()
    for ( var i = 3; i < length; i ++ ) {
      arr[i] = rand_large()
    }
    return arr
  }

  var arb_int = as_generator(random_int)


  var results = for_all(arb_int, arb_int)
                  .satisfy(correct_result)

}()
