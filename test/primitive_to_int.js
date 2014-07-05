var claire = require('claire')
var as_generator = claire.asGenerator
var rn = require('random-number')
var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
var large_numbers = rn.generator({min: 0, max: Math.pow(2,53), integer: true})
var bygen = as_generator(function(){return simple_numbers()})
var to_base10 = require('../to_base10.js')
var equal = require('../integer_equality.js')
var zero = require('../zero.js')
var one = require('../one.js')
var to_int = require('../primitive_to_int.js')
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')
var int_analyzer = require('./claire-helpers/analyze_int.js')
var print = require('../print.js')

function samestring(primitive){
  var bigint = to_int(primitive)
  var str = to_base10(bigint)
  return  str === primitive.toString()
}



var props = [
  { title : 'same string'
  , fn: samestring
  , args:  [arb_primitive]
  , analyze: analyzer(int_analyzer)
  }
]

klara(1000, props)
