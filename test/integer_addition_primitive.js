var memory = require('../memory.js')
var add = require('../integer_addition.js')
var addp = require('../integer_add_primitive.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.positive)
//var arb_int = as_generator(rand_int('tiny', 'simple', 'positive'))
var rn = require('random-number')
var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
var large_numbers = rn.generator({min: 0, max: Math.pow(2,53), integer: true})
var arb_primitive = as_generator(function(){return large_numbers()})
var bygen = as_generator(function(){return simple_numbers()})
var equal = require('../integer_equality.js')
var liberate = require('liberate')
var join = liberate(Array.prototype.join)
var log = console.log.bind(console)
var zero = require('../zero.js')
var to_int = require('../primitive_to_int.js')
var klara = require('./claire-helpers/klara.js')
var left_pad = require('../left_pad.js')
var analyzer = require('./claire-helpers/analyzer.js')
var print = require('../print.js')


function associativity(a, b, c){
//print('a', a)
//print('b', b)
//console.log('c', c)
  var bc = addp(b, c)
  var ab = add(a, b)
//print('bc', bc)
//print('ab', ab)
  var a_bc = add(a, bc)
  var ab_c = addp(ab, c)
//print('a_bc', a_bc)
//print('ab_c', ab_c)
  return  equal(a_bc, ab_c)
}

function shift(A, P, by){
  return equal(add(A, left_pad(to_int(P), by)), addp(A, P, by))
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')
var int_analyzer = require('./claire-helpers/analyze_int.js')

var props = [
  { title : 'associativity'
  , fn: associativity
  , args:  [arb_int, as_generator(function(){ return zero}), arb_primitive]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, int_analyzer)
  , end: memory.reset
  }
 ,
  { title : 'shift'
  , fn: shift
  , args: [arb_int, arb_primitive, bygen]
  , analyze: analyzer(bigint_analyzer, int_analyzer, int_analyzer)
  , end: memory.reset
  }
]

klara(1000, props)
