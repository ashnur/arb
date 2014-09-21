var memory = require('../memory.js')
var pointers = memory.pointers
var values = memory.values
var numbers = memory.numbers
var temp = memory.temp
var floor = Math.floor

var right_shift = require('../integer_right_shift.js')
var multiply = require('../integer_multiplication.js')
var equal = require('../integer_equality.js')
var one = require('../one.js')
var zero = require('../zero.js')
var to_int = require('../primitive_to_int.js')
var left_pad = require('../left_pad.js')


var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var klara = require('./claire-helpers/klara.js')
var rn = require('random-number')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,20], 'complex', 'positive'))
var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
var normal_numbers = rn.generator({min: 0, max: Math.pow(2,9), integer: true})
var arb_primitive = as_generator(function(){return normal_numbers()})
var analyzer = require('./claire-helpers/analyzer.js')
var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')
var int_analyzer = require('./claire-helpers/analyze_int.js')

function powof2(p){
  var R = zero
  if ( p === 0 ) return R
  var words = Math.floor(p / 16)
  p = p - words * 16
  return left_pad(to_int(Math.pow(2, p)), words)
}


var inputs = [
  [[12486, 33335, 61143, 31631, 104],[21], [48145, 32630, 17372, 3]]
, [[0,1],[1], [32768]]
, [[0,1024],[15], [2048]]
, [[0,0,1],[15], [0,2]]
]

// var props = [
//   { title : 'same as multiplying with 2'
//   , fn: multiplybypowof2
//   , args: [arb_int, arb_primitive]
//   , analyze: analyzer(bigint_analyzer, int_analyzer)
//   , end: memory.reset
//   }
// ]

inputs.forEach(function(z){

var arr_to_int = require('./helpers/arr_to_int.js')

var I = arr_to_int(z[0])
var V = arr_to_int(z[2])
var R = right_shift(I, z[1])
console.log('equal', equal(R, V))
})

// klara(1000, props)
