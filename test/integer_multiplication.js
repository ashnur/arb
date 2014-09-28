var memory = require('../memory.js')
var temp = memory.temp
var numbers = memory.numbers

var multiply = require('../integer_multiplication.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,2], 'simple', 'positive'))
var equal = require('../integer_equality.js')
var one = require('../one.js')
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var console_log = console.log.bind(console)
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')

var debug = require('../debug.js')
var print = require('../print.js')

function associativity(a, b, c){
  var ab = multiply(a, b, numbers)
  var bc = multiply(b, c, numbers)
  var ab_c = multiply(ab, c, numbers)
  var a_bc = multiply(a, bc, numbers)
  var r = equal(ab_c, a_bc)

  return r
}

function commutativity(a, b){
  var ab = multiply(a, b, numbers)
  var ba = multiply(b, a, numbers)
  var r = equal(ab, ba)
  return r
}

function identity(a){
  return equal(multiply(a, one, numbers), a)
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
  , end: function(){ memory.stacks.free(1) }
  }
,
  { title : 'commutativity'
  , fn: commutativity
  , args: [arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
,
  { title : 'associativity'
  , fn: associativity
  , args: [arb_int, arb_int, arb_int]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
]

var times = 100
while ( times -- > 0 ) {
  klara(100, props)
}

function topoly(c, p){ 
  return c == 0 ? ''
       : c == 1 ? p == 0 ? '1'
                : p == 1 ? '(2^26)'
                :          '(2^26)^'+p
       : p == 0 ? c
       : p == 1 ? c + '*(2^26)'
       : c + '*(2^26)^' + p
}
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
function lengthnot0(s){ return s.length != 0 }
function topolynom(a){
  return '(' + toarr(a).map(topoly).filter(lengthnot0).join('+') + ')'
}

var arr_to_int = require('./helpers/arr_to_int.js')
  ;[
//    [[0, 1, 1],[1, 0x1000000],[0, 0x3fffffd]]
//    [[53158618, 53175157, 31483026],[30417118, 54687773],[17032450, 59213669]]
  ].forEach(function(inputs){
    var a = arr_to_int(inputs[0])
    var b = arr_to_int(inputs[1])
    var c = arr_to_int(inputs[2])
    console_log('a', topolynom(a))
    console_log('b', topolynom(b))
    console_log('c', topolynom(c))
    //console_log(dumpta(memory.values[a].ads, 50))
    //console_log(dumpta(memory.values[a].data, 50))
    var ab = multiply(a, b, numbers)
    print('ab', ab)
    console_log('ab', topolynom(ab))
    var bc = multiply(b, c, numbers)
    print('bc', bc)
    console_log('bc', topolynom(bc))
    
    var ab_c = multiply(ab, c, numbers)
    var a_bc = multiply(a, bc, numbers)
    console_log('ab_c', topolynom(ab_c))
    console_log('a_bc', topolynom(a_bc))
    console_log('---')
    if ( ! equal(ab_c, a_bc) ) throw new Error('failed')
  })
