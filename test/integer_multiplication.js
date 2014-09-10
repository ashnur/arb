var memory = require('../memory.js')

var multiply = require('../integer_multiplication.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,20], 'complex', 'positive'))
var equal = require('../integer_equality.js')
var one = require('../one.js')
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var log = console.log.bind(console)
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')
var print = require('../print.js')


function associativity(a, b, c){
  var ab = multiply(a, b)
  var bc = multiply(b, c)
  var ab_c = multiply(ab, c)
  var a_bc = multiply(a, bc)
  var r = equal(ab_c, a_bc)
  if ( ! r ) {
    print('a', a)
    print('b', b)
    print('ab', ab)
    print('c', c)
    print('ab_c', ab_c)
    print('b', b)
    print('c', c)
    print('bc', bc)
    print('a_bc', a_bc)

  }
  return r
}

function commutativity(a, b){
  var ab = multiply(a, b)
  var ba = multiply(b, a)
  var r = equal(ab, ba)
  if ( ! r ) {
    print('a', a)
    print('b', b)
    print('ab', ab)
    print('ba', ba)
    console.log(tomul(a, b))
  }
  return r
}

function identity(a){
  return equal(multiply(a, one), a)
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

function cleanup(){
  memory.reset()
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

// var to_int = require('../primitive_to_int.js')
// var A = to_int(65541)
// var B = to_int(393217)
// var A = num([16688])
// var B = num([44613 , 10586])
// var z = multiply(A, B)
// var t = multiply(B, A)
// print('A * B', z )
// print('B * A', t )
// console.log('equal', equal(t, z))

klara(1000, props)


function topoly(c, p){ return c + '*' + '(2^16)^' + p }
function toarr(id){
  var t = memory.values[id]
  var p = memory.pointers[id]
  var data = t.data
  var didx = t.ads[p]
  var arr = []
  var size = data[didx]
  var idx = didx + 2
  while ( idx < didx + size ) {
    arr.push(data[idx++])
  }
  return arr
}
function topolynom(a){
  return '(' + toarr(a).map(topoly).join('+') + ')'
}
function tomul(a, b){
  var A = topolynom(a)
  var B = topolynom(b)
  return 'convert ' +A + '*' + B + ' to base 65536'
}

function num(arr){
  var id = memory.numbers(arr.length + 2)
  var t = memory.values[id]
  var p = memory.pointers[id]
  var data = t.data
  var didx = t.ads[p]
  data[didx + 1] = 0
  for ( var i = 2; i < data[didx]; i++ ) {
    data[didx + i] = arr[i - 2]
  }
  return id
}



