var memory = require('../memory.js')
var data = memory.data
var alloc = memory.alloc
var ads = memory.ads
var add = require('../integer_addition.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.positive)
//var arb_int = as_generator(rand_int('small', 'simple', 'positive'))
var equal = require('../integer_equality.js')
var liberate = require('liberate')
var join = liberate(Array.prototype.join)
var log = console.log.bind(console)
var max = Math.max
var zero = require('../zero.js')
var klara = require('./claire-helpers/klara.js')
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var reduce = liberate(Array.prototype.reduce)
var every = liberate(Array.prototype.every)
var slice = liberate(Array.prototype.slice)
var join = liberate(Array.prototype.join)
var analyzer = require('./claire-helpers/analyzer.js')

var print = require('../print.js')

var get_new_zero = require('../get_new_zero.js')
function associativity(a, b, c){
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
//print ( 'a:\n', a)
//print ( 'b:\n', b)
//print ( 'c:\n', c)
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
  var ab = add(a, b)
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
//print ( '\nab:\n', ab)
  var bc = add(b, c)
//print ( '\nbc:\n', bc)

  var x = add(a, bc)
  var y = add(ab, c)
//print ( '\na+bc:\n', x)
//print ( '\nab+c:\n', y)
  return equal(x, y)
}

function commutativity(a, b){
  var r =  equal(add(a, b), add(b, a))
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
  return r
}

function identity(a){
  var r = equal(add(a, zero), a)
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
  return r
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

function dump(){
  var values = slice(memory.data,0)
  var val_out = []
  values.forEach(function(v, i){
    val_out.push([v+ ',' + i])
  })
  console.log('values')
  console.log(val_out.join('|'))
  var indeces = slice(memory.ads,0)
  var ind_out = []
  indeces.forEach(function(v, i){
    ind_out.push(i+ ',' + v )
  })
  console.log('indeces')
  console.log(ind_out.join('|'))
  console.log('break', memory.brk())
  console.log('last', memory.lst())
  console.log('unalloc', memory.unalloc())
}

function vd(){
}

var props = [
  { title : 'identity'
  , fn: identity
  , args: [arb_int]
  , analyze: analyzer(bigint_analyzer)
  , end: memory.reset
  }
,
  { title : 'commutativity'
  , fn: commutativity
  , args: [arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer)
  , end: memory.reset
  }
,
  { title : 'associativity'
  , fn: associativity
  , args: [arb_int, arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: memory.reset
  }
]
klara(1000, props)
