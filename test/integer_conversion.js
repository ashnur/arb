var rn = require('random-number')
var claire = require('claire')
var as_generator = claire.asGenerator
var log = console.log.bind(console)
var klara = require('./claire-helpers/klara.js')
var memory = require('../memory.js')
var parse = require('../parse_base10.js')
var to_base10 = require('../to_base10.js')
var rand_int = require('./helpers/rand_int.js')
var arb_int = as_generator(rand_int.positive)
var print = require('../print.js')

var chunk_count = rn.bind(null, {min: 0, max: 5, integer:true})
var chunk_value = rn.bind(null, {min: 0, max: Math.pow(2,31), integer:true})
function random_base10(){
  return Array.apply(null, Array(chunk_count()))
              .map(chunk_value)
              .join('')
}

var int_str = as_generator(random_base10)

function convert(str){
  var z = parse(str)
  var rstr = to_base10(z)
  return str == rstr
}


var props = [
  { title : 'conversion'
  , fn: convert
  , args: [int_str]
  , end: memory.reset
  }
]
klara(100, props)
