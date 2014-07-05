var memory = require('../memory.js')
var alloc = memory.alloc
var ads = memory.ads
var data = memory.data
var right_shift = require('../integer_right_shift.js')
var multiply = require('../integer_multiplication.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var rn = require('random-number')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,20], 'complex', 'positive'))
var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
var normal_numbers = rn.generator({min: 0, max: Math.pow(2,9), integer: true})
var arb_primitive = as_generator(function(){return normal_numbers()})
var equal = require('../integer_equality.js')
var one = require('../one.js')
var zero = require('../zero.js')
var to_int = require('../primitive_to_int.js')
var left_pad = require('../left_pad.js')
var log = console.log.bind(console)
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')
var print = require('../print.js')
var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')
var int_analyzer = require('./claire-helpers/analyze_int.js')

function powof2(p){
  var R = zero
  if ( p === 0 ) return R
  var words = Math.floor(p / 16)
  p = p - words * 16
  return left_pad(to_int(Math.pow(2, p)), words)
}

function arr_to_int(arr){
console.log(arr)
  var I = alloc(arr.length + 2)
  data[I] = 0 //type integer
  var idx = ads[I]
  data[idx] = arr.length
  var i = 0
  while ( idx != 0 ) {
    idx = ads[idx]
    data[idx] = arr[i++]
  }
  return I
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

var I = arr_to_int(z[0])
print('I', I)
var V = arr_to_int(z[2])
print('V', V)
var R = right_shift(I, z[1])
print('R', R)
console.log('equal', equal(R, V))
})

// klara(1000, props)