var liberate = require('liberate')
var claire = require('claire')
var rand_int = require('./helpers/rand_int.js')
var print = require('../print.js')

var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')

var map = liberate(Array.prototype.map)
var reduce = liberate(Array.prototype.reduce)
var every = liberate(Array.prototype.every)
var slice = liberate(Array.prototype.slice)
var join = liberate(Array.prototype.join)

var max = Math.max
var min = Math.min
var log = console.log.bind(console)

var memory = require('../memory.js')
var temp = memory.temp

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

var props = [
  { title : 'identity'
  , fn: identity
  , args: [arb_int]
  , analyze: analyzer(bigint_analyzer)
  , end: function(){
      memory.stacks.free(1)
    }
  }
,
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
// print ( 'a:', a)
// print ( 'b:', b)
// print ( 'c:', c)
  var ab = add(a, b, temp)
  var bc = add(b, c, temp)
// print ( 'ab:', ab)
// print ( 'bc:', bc)
//
  var x = add(a, bc, temp)
  var y = add(ab, c, temp)
// print ( 'a:', a)
// print ( 'b:', b)
// print ( 'c:', c)
// print ( 'ab:', ab)
// print ( 'bc:', bc)
// print ( 'a+bc:', x)
// print ( 'ab+c:', y)
  var r = equal(x, y) 
  if ( ! r ) success = false
  return r
}

function commutativity(a, b){
  //print ( 'a:', a)
  //print ( 'b:', b)
  var ab = add(a, b, temp)
  //print ( 'ab:', ab)
  var ba = add(b, a, temp)
  //print ( 'ba:', ba)
  var r =  equal(ab, ba)
  if ( ! r ) success = false
  return r
}

function identity(a){
  var r = equal(add(a, zero, temp), a)
  if ( ! r ) success = false
  return r
}

var runner = klara.bind(null, 1, props)
runner()

bb.all(runner())//.then(runner)



// function make_num(arr){
//   var num = memory.numbers(arr.length)
//   var pointer = memory.pointers[num]
//   var t = memory.values[num]
//   var didx = t.ads[pointer]
//   var data = t.data
//   for ( var i = 0; i < arr.length; i++ ) {
//     data[didx + i] = arr[i]
//   }
//
//   return num
// }
// var comm_tests = [
// [ [7 , 0 , 0 , 0 , 0 , 0 , 1], [6 , 0 , 0 , 0 , 0 , 1]], // 13 13
// [ [7 , 0 , 0 , 0 , 0 , 0 , 1], [6 , 0 , 0 , 0 , 0 , 1]], // 13 26
// [ [7 , 0 , 0 , 0 , 0 , 0 , 1], [6 , 0 , 0 , 0 , 0 , 1]], // 13 39
// [ [7 , 0 , 0 , 0 , 0 , 0 , 1], [5 , 0 , 0 , 0 , 1]],     // 12 51
// [ [7 , 0 , 0 , 0 , 0 , 0 , 1], [3 , 0 , 1]],             // 10 61
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [6 , 0 , 0 , 0 , 0 , 1]], // 12 73
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [5 , 0 , 0 , 0 , 1]],     // 11 84
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [5 , 0 , 0 , 0 , 1]],     // 11 95
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [4 , 0 , 0 , 1]],         // 10 105
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [4 , 0 , 0 , 1]],         // 10 115
// [ [6 , 0 , 0 , 0 , 0 , 1]    , [3 , 0 , 1]],             //  9 124
// [ [5 , 0 , 0 , 0 , 1]        , [6 , 0 , 0 , 0 , 0 , 1]], // 11 135
// [ [5 , 0 , 0 , 0 , 1]        , [6 , 0 , 0 , 0 , 0 , 1]], // 11 146
// [ [5 , 0 , 0 , 0 , 1]        , [4 , 0 , 0 , 1]],         //  9 155
// [ [5 , 0 , 0 , 0 , 1]        , [3 , 0 , 1]],             //  8 163
// [ [4 , 0 , 0 , 1]            , [5 , 0 , 0 , 0 , 1]],     //  9 172
// [ [3 , 0 , 1]                , [6 , 0 , 0 , 0 , 0 , 1]], //  9 181
// [ [3 , 0 , 1]                , [5 , 0 , 0 , 0 , 1]],     //  8 189
// [ [3 , 0 , 1]                , [3 , 0 , 1]],             //  6 195
// [ [3 , 0 , 1]                , [3 , 0 , 1]],             //  6 201
// [ [3 , 0 , 1]                , [3 , 0 , 1]]              //  6 207
//
// ]
//
// comm_tests.forEach(function(inputs){
//   console.log('----')
//   var a = make_num(inputs[0])
//   var b = make_num(inputs[1])
//   console.log('====')
//
//   var r =  equal(add(a, b), add(b, a))
//   console.log('≡≡≡≡')
//   if ( !r ) throw new Error('gotcha')
// })
// console.log('done')

function id(x){ return x }

function dumpta(ta){
  return map(ta, id).join(',')//.replace(/(?:,0)*$/,'').split(',')
}

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
