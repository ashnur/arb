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
var log = console.log.bind(console)

var memory = require('../memory.js')

var add = require('../integer_addition.js')
var equal = require('../integer_equality.js')

var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.positive)

var zero = require('../zero.js')
var get_new_zero = require('../get_new_zero.js')


// var arb_int = as_generator(rand_int('small', 'simple', 'positive'))

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

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

function associativity(a, b, c){
// print ( 'a:', a)
// print ( 'b:', b)
// print ( 'c:', c)
  var ab = add(a, b)
  var bc = add(b, c)
// print ( 'ab:', ab)
// print ( 'bc:', bc)
//
  var x = add(a, bc)
  var y = add(ab, c)
// print ( 'a:', a)
// print ( 'b:', b)
// print ( 'c:', c)
// print ( 'ab:', ab)
// print ( 'bc:', bc)
// print ( 'a+bc:', x)
// print ( 'ab+c:', y)
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
  return equal(x, y)
}

function commutativity(a, b){
  // print ( 'a:', a)
  // print ( 'b:', b)
  var r =  equal(add(a, b), add(b, a))
  if ( ! equal(zero, get_new_zero()) ) throw new Error ( 'y u no 0')
  return r
}

function identity(a){
  var r = equal(add(a, zero), a)
  var nz = get_new_zero()
  var tz = memory.values[zero]
  var tnz = memory.values[nz]
//console.log('p', memory.pointers[zero], memory.pointers[nz])
//console.log('tz', dumpta(tz.ads), dumpta(tz.data))
//console.log('tnz', dumpta(tnz.ads), dumpta(tnz.data))
  if ( ! equal(zero, nz) ) throw new Error ( 'y u no 0')
  return r
}

klara(1000, props)


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
