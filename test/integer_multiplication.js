var memory = require('../memory.js')
var temp = memory.temp
var numbers = memory.numbers

var multiply = require('../integer_multiplication.js')
var rand_int = require('./helpers/rand_int.js')
var claire = require('claire')
var as_generator = claire.asGenerator
var arb_int = as_generator(rand_int.static_generator([1,20], 'complex', 'positive'))
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

// var to_int = require('../primitive_to_int.js')
// var A = to_int(65541)
// var B = to_int(393217)
// var A = num([16688])
// var B = num([44613 , 10586])
// var z = multiply(A, B)
// var t = multiply(B, A)

//function run() { 
//  return Promise.all(klara(1, props)).then(cont).error(debug.log.bind(null, times))
//}
//
//function cont(result){ 
//  if ( times-- > 0 ) { 
//    return run() 
//  } else { return result }
//}
//
//run().then(function(){
//  console.log('xxx', arguments)
//})
//klara(11, props)
var times = 100
while ( times -- > 0 ) {
  klara(100, props)
}

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

var arr_to_int = require('./helpers/arr_to_int.js')
  ;[
//[[43844, 14859, 57781, 17531, 19009, 9880, 6147, 18038],[52490, 9791, 36721, 53353, 23320]]
    // 93659137761710733703201699677292178244
  ].forEach(function(inputs){
    console_log('- - - - - - - - - s t a r t')
    var a = arr_to_int(inputs[0])
    var b = arr_to_int(inputs[1])
    console_log('a', topolynom(a))
    //console_log('a id', a, memory.pointers[a], memory.values[a].ads[memory.pointers[a]])
    //console_log(dumpta(memory.values[a].ads, 50))
    //console_log(dumpta(memory.values[a].data, 50))
    console_log('b', topolynom(b))
    var ab = multiply(a, b, numbers)
    print('ab', ab)
    debugger
    var ba = multiply(b, a, numbers)
    print('ba', ba)
    console_log('---')
    //console_log('a id', a, memory.pointers[a], memory.values[a].ads[memory.pointers[a]])
    //console_log(dumpta(memory.values[a].ads, 50))
    //console_log(dumpta(memory.values[a].data, 50))
    if ( ! equal(ab, ba) ) throw new Error('failed')
    //memory.stacks.free(1)
    console_log('- - - - - - - - - e n d')
  })
