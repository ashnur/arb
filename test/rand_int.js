void function(){
  var rn = require('random-number')
  var pool = require('../pool.js')
  var sign = require('../sign.js')


  var rand_bool = rn.bind(null, {integer:true})
  var rand_small_nat = rn.bind(null, {min: 0, max: 10, integer:true})
  var rand_large = rn.bind(null, {min: 1, max:65535, integer:true})
  var rand_large_nat = rn.bind(null, {min: 1, max:65535, integer:true})


  function random_int(length, s){
    var arr = pool('integer', length)
    s = s == null ? rand_bool() : s
    sign.change(arr, s)
    if ( length > 0 ) arr[2] = rand_large_nat()
    for ( var i = 3; i < length + 2; i ++ ) {
      arr[i] = rand_large()
    }
    return arr
  }

  module.exports = random_int

  module.exports.positive = function positive(){
    return random_int(rand_small_nat(), 0)
  }

  module.exports.generator_of_size = function(size_min, size_max, s){
    return random_int.bind(null, rn({integer: true, min: size_min, max: size_max}), s)
  }

}()
