var rn = require('random-number')
var claire = require('claire')
var as_generator = claire.asGenerator
var klara = require('./claire-helpers/klara.js')
var memory = require('../memory.js')
var temp = memory.temp

var parse = require('../parse_base10.js')
var to_base10 = require('../to_base10.js')

var rand_int = require('./helpers/rand_int.js')
var arb_int = as_generator(rand_int.positive)

var console_log = console.log.bind(console)

var chunk_count = rn.bind(null, {min: 0, max: 5, integer:true})
var chunk_value = rn.bind(null, {min: 0, max: Math.pow(2,31), integer:true})

var print = require('../print.js')

function random_base10(){
  return Array.apply(null, Array(chunk_count()))
              .map(chunk_value)
              .join('')
}

var int_str = as_generator(random_base10)

function convert(str){
console.log(str)
  var z = parse(str, temp)
print('z', z)
  var rstr = to_base10(z, temp)
  return str == rstr
}


var props = [
  { title : 'conversion'
  , fn: convert
  , args: [int_str]
  , end: function(){ memory.stacks.free(1) }
  }
]
//var times = 1
//while ( times -- > 0 ) {
//  klara(1, props)
//}


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
    ['93659137761710733703201699677292178244', [43844, 14859, 57781, 17531, 19009, 9880, 6147, 18038]]
  ].forEach(function(inputs){
    console_log('- - - - - - - - - s t a r t')
    var a = arr_to_int(inputs[1])
    print('a', a)
    // console_log('a', topolynom(a))
    var b = parse(inputs[0], temp)
    print('b', b)
    //debugger
    var c = to_base10(b, temp)
    //console.log('c', c)
    //console_log('---')
    if ( c !== inputs[0] ) throw new Error('failed')
    //memory.stacks.free(1)
    console_log('- - - - - - - - - e n d')
  })
