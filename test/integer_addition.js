var liberate = require('liberate')
var claire = require('claire')
var rand_int = require('./helpers/rand_int.js')

var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')

var map = liberate(Array.prototype.map)
var reduce = liberate(Array.prototype.reduce)
var every = liberate(Array.prototype.every)
var slice = liberate(Array.prototype.slice)
var join = liberate(Array.prototype.join)

var max = Math.max
var min = Math.min

var memory = require('../memory.js')
var temp = memory.temp
var numbers = memory.numbers

var add = require('../integer_addition.js')
var equal = require('../integer_equality.js')

var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.positive)

var zero = require('../zero.js')
var get_new_zero = require('../get_new_zero.js')


var arb_int = as_generator(rand_int('small', 'simple', 'positive'))

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

var bb = require('bluebird')
var jp = bb.join

var print = require('../print.js')
var debug = require('../debug.js')
var console_log = console.log.bind(console)

var props = [
//  { title : 'identity'
//  , fn: identity
//  , args: [arb_int]
//  , analyze: analyzer(bigint_analyzer)
//  , end: function(){
//      memory.stacks.free(1)
//    }
//  }
//,
  { title : 'commutativity'
  , fn: commutativity
  , args: [arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer)
  , end: function(){
      memory.stacks.free(1)
    }
  }
,
  { title : 'associativity'
  , fn: associativity
  , args: [arb_int, arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: function(){
      memory.stacks.free(1)
    }
  }
]


function associativity(a, b, c){
  var ab = add(a, b, numbers)
  var bc = add(b, c, numbers)
  var x = add(a, bc, numbers)
  var y = add(ab, c, numbers)
  var r = equal(x, y) 
  return r
}

function commutativity(a, b){
  var ab = add(a, b, numbers)
  var ba = add(b, a, numbers)
  var r =  equal(ab, ba)
  return r
}

function identity(a){
  //print('A', a)
  var b = add(a, zero, numbers)
  //print('B', b)

  var r = equal(b, a)
  return r
}

var times = 1000
while(times -- > 0){
  klara(1, props)
}

//var runner = klara.bind(null, 1, props)

//bb.all(runner())//.then(runner)

