var liberate = require('liberate')
var rand = require('random-number')

var memory = require('../memory.js')
var temp = memory.temp

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
  return r
}

function add_difference(n, m, k){
  var x = subtract(m, k)
  var a = add(n, x)
  var y = add(n, m)
  var b = subtract(y, k)
  var r = equal(a, b)
  return r
}

function subtract_difference(n, m, k){
  var m_k = subtract(m, k)
  var a = subtract(n, m_k)
  var n_m = subtract(n, m)
  var b = add(n_m, k)
  var a_b = add(a, b)
  var b_a = add(b, a)
  var r = equal(a_b, b_a)
  return r
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

var size_1_int = as_generator(rand_int.static_generator([1,9], 'complex', 'positive'))
var size_2_int = as_generator(rand_int.static_generator([10,19], 'complex', 'positive'))
var size_3_int = as_generator(rand_int.static_generator([19,29], 'complex', 'positive'))
var size_4_int = as_generator(rand_int.static_generator([20,29], 'complex', 'positive'))
var size_5_int = as_generator(rand_int.static_generator([1,100], 'complex', 'positive'))
var size_1_int = as_generator(rand_int.static_generator([15,16], 'complex', 'positive'))
var size_2_int = as_generator(rand_int.static_generator([16,17], 'complex', 'positive'))
var size_3_int = as_generator(rand_int.static_generator([17,18], 'complex', 'positive'))
var size_4_int = as_generator(rand_int.static_generator([18,19], 'complex', 'positive'))
var size_5_int = as_generator(rand_int.static_generator([19,100], 'complex', 'positive'))
var props = [
  { title : 'subtract_sum'
  , fn  : subtract_sum
  , args: [size_3_int, size_1_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
 ,
  { title : 'add_difference'
  , fn  : add_difference
  , args:  [size_5_int, size_2_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
,
  { title : 'subtract_difference'
  , fn  : subtract_difference
  , args: [size_4_int, size_2_int, size_1_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
]
var times = 1000
while(times-- > 0){
  klara(5, props)
}
// var A = num([9,9,9,9,9,9,9,9])
// var B = num([8,9,9,9,9,9,9,9])
// var z = subtract(A, B)
//
// function num(arr){
//   var id = memory.numbers(arr.length + 2)
//   var t = memory.values[id]
//   var p = memory.pointers[id]
//   var data = t.data
//   var didx = t.ads[p]
//   data[didx + 1] = 0
//   for ( var i = 2; i < data[didx]; i++ ) {
//     data[didx + i] = arr[i - 2]
//   }
//   return id
// }
//
//
