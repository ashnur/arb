var liberate = require('liberate')
var rand = require('random-number')

var memory = require('../memory.js')
var add = require('../integer_addition.js')
var subtract = require('../integer_subtraction.js')
var equal = require('../integer_equality.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var slice = liberate(Array.prototype.slice)
var every = liberate(Array.prototype.every)
var join = liberate(Array.prototype.join)
var log = console.log.bind(console)
var analyzer = require('./claire-helpers/analyzer.js')
var klara = require('./claire-helpers/klara.js')
var print = require('../print.js')
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var forEach = liberate(Array.prototype.forEach)
var filter = liberate(Array.prototype.filter)

function size(idx){
  return memory.values[idx].data[memory.values[idx].ads[memory.pointers[idx]]]
}

function subtract_sum(n, m, k){
  var mk = add(m, k)
  var a = subtract(n, mk)
  var b = subtract(subtract(n, m), k)
  var r = equal(a, b)
if ( ! r ) {
 print('n         ', n)
 print('m         ', m)
 print('k         ', k)
 print('m + k     ', mk)
 print('n - (m + k)', a)
 print('n - m - k', b)
}
  return r
}

function add_difference(n, m, k){
  var x = subtract(m, k)
  var a = add(n, x)
  var y = add(n, m)
  var b = subtract(y, k)
  var r = equal(a, b)
if ( ! r ) {
 print('n         ', n)
 print('m         ', m)
 print('k         ', k)
 print('m - k     ', x)
 print('n + m - k ', a)
 print('n + m     ', y)
 print('n + m - k ', b)
 console.log('n + (m - k) == (n + m) - k', r)
}
  return r
}

function subtract_difference(n, m, k){
  var a = subtract(n, subtract(m, k))
  var b = add(subtract(n, m), k)
  return equal(add(a, b), add(b, a))
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

var size_1_int = as_generator(rand_int.static_generator([1,9], 'complex', 'positive'))
var size_2_int = as_generator(rand_int.static_generator([10,19], 'complex', 'positive'))
var size_3_int = as_generator(rand_int.static_generator([19,29], 'complex', 'positive'))
var size_4_int = as_generator(rand_int.static_generator([20,29], 'complex', 'positive'))
var size_5_int = as_generator(rand_int.static_generator([1,100], 'complex', 'positive'))
//var size_1_int = as_generator(rand_int.static_generator([1,2], 'simple', 'positive'))
//var size_2_int = as_generator(rand_int.static_generator([3,4], 'simple', 'positive'))
//var size_3_int = as_generator(rand_int.static_generator([5,6], 'simple', 'positive'))
//var size_4_int = as_generator(rand_int.static_generator([7,8], 'simple', 'positive'))
//var size_5_int = as_generator(rand_int.static_generator([9,10], 'simple', 'positive'))
var props = [
  { title : 'subtract_sum'
  , fn  : subtract_sum
  , args: [size_3_int, size_1_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: memory.reset
  }
 ,
  { title : 'add_difference'
  , fn  : add_difference
  , args:  [size_5_int, size_2_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: memory.reset
  }
,
  { title : 'subtract_difference'
  , fn  : subtract_difference
  , args: [size_4_int, size_2_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: memory.reset
  }
]

klara(1000, props)
