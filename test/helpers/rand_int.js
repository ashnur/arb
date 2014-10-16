var arb = require('../../integer.js')
var rn = require('random-number')
var rint = rn.generator({integer: true})

var rand_bool = rn.bind(null, {integer:true})
var rand_small_nat = rn.bind(null, {min: 1, max: 5, integer:true})
var rand_large = rn.bind(null, {min: 1, max:2, integer:true})
var rand_large_nat = rn.bind(null, {min: 1, max:2, integer:true})

var is_arr = Array.isArray


function random_bigint(l, s, bigit){
  var minlength = l[0] + 2
  var maxlength = Math.max(minlength, l[1])
  var bigit_count = rint(minlength, maxlength)
  var arr = [bigit_count, bigit_count > 2 ? (s == null ? rint(0, 1) : s) : 0]

  for ( var i = 2; i < bigit_count; i ++ ) {
    if ( i == bigit_count -1 ) {
      var min = bigit[0] == 0 ? 1 : bigit[0]
      var max = bigit[1] == 0 ? 1 : bigit[1]
      arr[i] = rint(min, max) // set min max on the integer generator
    } else {
      arr[i] = rint(bigit[0], bigit[1]) // set min max on the integer generator
    }
  }
//  console.log('arr', arr)
  return arb.arr_to_int(arr)
}

function bigint_generator(size, complexity, sign){
  var s      = sign == 'positive'     ? 0
             : sign == 'negative'     ? 1
             :                          undefined

  var bigit  = complexity == 'simple' ? [0, 9]
             : is_arr(complexity)     ? complexity
             :                          [0, 0x3ffffff]

  var l      = size == 'tiny'         ? [0, 1]
             : size == 'small'        ? [1, 5]
             : is_arr(size)           ? size
             :                          [0, 100]

  return random_bigint.bind(null, l, s, bigit)
}

module.exports = bigint_generator

module.exports.static_generator = function(size, complexity, sign){
  var gen = bigint_generator(size, complexity, sign)
  return function(){ return gen() }
}

module.exports.positive = bigint_generator(null, null, 0)

module.exports.generator_of_size = function(size_min, size_max, s){
  return bigint_generator([size_min, size_max], null, s)
}
