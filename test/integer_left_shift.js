var memory = require('../memory.js')
var leftshift = require('../integer_left_shift.js')
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

function multiplybypowof2(a, b){
  var A = leftshift(a, b)
  var P = powof2(b)
  var AP = b ? multiply(a, P) : a
  var r = equal(A, AP)
  if ( ! r ) {
    print('a', a)
    log('b', b)
    print('P', P)
    print('A', A)
    print('AP', AP)
  }
  return r
}

var props = [
  { title : 'same as multiplying with 2'
  , fn: multiplybypowof2
  , args: [arb_int, arb_primitive]
  , analyze: analyzer(bigint_analyzer, int_analyzer)
  , end: memory.reset
  }
]

// var to_int = require('../primitive_to_int.js')
// var A = to_int(65541)
// print('A ', A )
// var B = to_int(393217)
// print('B ', B )
// var z = multiply(A, B)
// var t = multiply(B, A)
// print('A * B', z )
// print('B * A', t )
// console.log('equal', equal(t, z))

klara(1000, props)
