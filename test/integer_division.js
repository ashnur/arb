var memory = require('../memory.js')
var data = memory.data
var ads = memory.ads
var alloc = memory.alloc
var divide = require('../integer_division.js')
var add = require('../integer_addition.js')
var multiply = require('../integer_multiplication.js')
var equal = require('../integer_equality.js')
var type = require('../type.js')
var sign = require('../sign.js')
var compare = require('../integer_compare_abs.js')
var div = require('../integer_division.js')
var rand_int = require('./helpers/rand_int.js')
var zero = require('../zero.js')
var one = require('../one.js')

var claire = require('claire')
var check = claire.check
var as_generator = claire.asGenerator
var dividend = as_generator(rand_int.static_generator([0,100], 'complex', 'positive'))
var divisor = as_generator(rand_int.static_generator([1,100], 'complex', 'positive'))
var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')
var log = console.log.bind(console)
var print = require('../print.js')
var to_int = require('../primitive_to_int.js')

function back_substitution(dividend, divisor){

  var result = divide(dividend, divisor)
  var quotient = result[0]
  var remainder = result[1]
  if ( compare(dividend, divisor) >= 0 ) {
    // normal eset, dividend a nagyobb, osztunk
    var r = add(multiply(quotient, divisor), remainder)
    var result =  equal(dividend, r)
  } else {
    // divisor a nagyobb, 0 eredmeny, divisor a maradek
    var result =  equal(quotient, zero) && equal(dividend, remainder)
  }
  //console.log('stats+', memory.brk(), memory.lst(), memory.unalloc())
  ;[dividend, divisor, quotient, remainder].forEach(function(bigint){
    if ( !equal(zero, bigint) && !equal(one, bigint) ) {
      //console.log('frr')
      memory.free(bigint)
    }
  })
  //console.log('stats-', memory.brk(), memory.lst(), memory.unalloc())
  return result
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

var props = [
  { title : 'back_substitution'
  , fn: back_substitution
  , args: [dividend, divisor]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer)
  , end: function(){
      memory.reset
      console.log('stats-end', memory.brk(), memory.lst(), memory.unalloc())
    }
  }
,
]

function arr_to_int(arr){
  var I = alloc(arr.length + 2)
  data[I] = 0 //type integer
  var idx = ads[I]
  data[idx] = arr.length
  var i = 0
  while ( idx != 0 ) {
    idx = ads[idx]
    data[idx] = arr[i++]
  }
  return I
}

function to_poly(name, arr){
  var r = []
  for ( var i = 2; i < data[arr + 1]; i++ ) {
    r.push(data[arr + i]  + ' * 65536^' +(i-2))
  }
  if ( ! r.length) r.push(0)
  log(name, r.join(' + '))
}

// ;[
//   [[0, 0, 1],[1]]
//  , [[3],[2]]
//  , [[9,5],[5]]
//  , [[5],[2]]
//  , [[1,9],[3]]
//  , [[5,9],[3]]
//  , [[1,5],[1]]
//  , [[20888,49150,23789], [40958,1573]]
//  , [[51736,18791,9178,18928,57606,50427], [65034,991,  2196,44177,13404]]
//  ].forEach(function(inputs){
//    var a = arr_to_int(inputs[0])
//    var b = arr_to_int(inputs[1])
//    print('a', a)
//    print('b', b)
//    var d = divide(a, b)
//    print('q', d[0])
//    print('r', d[1])
//    var c = add(multiply(d[0], b), d[1])
//    print('c', c)
//    if ( ! equal(c, a) ) throw new Error('failed')
//    print('a', a)
//    print('b', b)
//    print('q', d[0])
//    print('r', d[1])
//  })



klara(1000, props)

