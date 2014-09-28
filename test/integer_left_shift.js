var rn = require('random-number')
var memory = require('../memory.js')
var values = memory.values
var pointers = memory.pointers
var numbers = memory.numbers
var temp = memory.temp
var leftshift = require('../integer_left_shift.js')

var multiply = require('../integer_multiplication.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,2], 'complex', 'positive'))
var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
var normal_numbers = rn.generator({min: 0, max: Math.pow(2,4), integer: true})
var arb_primitive = as_generator(function(){return normal_numbers()})

var equal = require('../integer_equality.js')
var one = require('../one.js')
var zero = require('../zero.js')

var to_int = require('../primitive_to_int.js')
var left_pad = require('../left_pad.js')
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')
var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')
var int_analyzer = require('./claire-helpers/analyze_int.js')

var print = require('../print.js')

function powof2(p){
  if ( p === 0 ) return zero
  var words = Math.floor(p / 26)
  p = Math.pow(2, p - words * 26)
  var P = to_int(p, temp)
  var PP = left_pad(P, words, temp)
  return PP
}

function multiplybypowof2(a, b){
  var A = leftshift(a, b)
  var P = powof2(b)

  var AP = b ? multiply(a, P) : a

  var r = equal(A, AP)
  return r
}

var props = [
  { title : 'same as multiplying with 2'
  , fn: multiplybypowof2
  , args: [arb_int, arb_primitive]
  , analyze: analyzer(bigint_analyzer, int_analyzer)
  , end: function(){memory.stacks.free()}
  }
]

klara(1000, props)
