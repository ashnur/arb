var noop = function(){}
var console_log = console.log.bind(console)
var memory = require('../memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var temp = memory.temp
var stacks = memory.stacks

var divide = require('../integer_division.js')
var add = require('../integer_addition.js')
var multiply = require('../integer_multiplication.js')

var equal = require('../integer_equality.js')
var compare = require('../integer_compare_abs.js')
var sign = require('../sign.js')

var rand_int = require('./helpers/rand_int.js')
var zero = require('../zero.js')
var one = require('../one.js')

var claire = require('claire')
var check = claire.check
var as_generator = claire.asGenerator

var dividend = as_generator(rand_int.static_generator([5,10], 'complex', 'positive'))
var divisor = as_generator(rand_int.static_generator([1,4], 'complex', 'positive'))

var klara = require('./claire-helpers/klara.js')
var analyzer = require('./claire-helpers/analyzer.js')

var to_int = require('../primitive_to_int.js')

var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)

function back_substitution(dividend, divisor){
  
  var mark = temp(2) //get a handle to temp where I can reset the breaking point back to with free()
  var result = divide(dividend, divisor)
  var quotient = result[0]
  var remainder = result[1]
  if ( compare(dividend, divisor) >= 0 ) {
    // normal eset, dividend a nagyobb, osztunk
  var r1 = multiply(quotient, divisor)
  
    var r = add(r1, remainder)
    var result =  equal(dividend, r)
  } else {
    // divisor a nagyobb, 0 eredmeny, divisor a maradek
    var result =  equal(quotient, zero) && equal(dividend, remainder)
  }
  memory.stacks.free(pointers[mark])
  return result
}

var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

var props = [
  { title : 'back_substitution'
  , fn: back_substitution
  , args: [dividend, divisor]
  , analyze: analyzer(bigint_analyzer, bigint_analyzer)
  , end: function(){ memory.stacks.free(1) }
  }
]

var arr_to_int = require('./helpers/arr_to_int.js')

 ;[
   [[0 , 2 ], [1]],
   [[0, 0, 1],[1]],
   [[3],[2]],
   [[9,5],[5]],
   [[5],[2]],
   [[1,9],[3]],
   [[5,9],[3]],
   [[1,5],[1]],
   [[20888,49150,23789], [40958,1573]],
   [[51736,18791,9178,18928,57606,50427], [65034,991,  2196,44177,13404]],   
   [[1 , 1 , 1 , 1, 1, 1 , 35064 , 42104 , 45289 , 23380 , 47782], [29164 , 54076]],
   [[2], [1]],
   [[1 , 0 , 0 , 1 , 1 , 36769 , 1 ], [28400 , 23082 ]],
   [[34016 , 59341 , 11456 , 45334 , 49105 , 51152 , 28732 ], [28400 , 23082 ]],
   [[25645 , 17084 , 34016 , 59341 , 11456 , 45334 , 49105 , 51152 , 28732 ], [28400 , 23082 ]],
   [[25645 , 17084 , 34016 , 59341 , 11456 , 45334 , 49105 , 51152 , 28732 , 19538 , 41057 , 16648 , 37688 , 35108], [50490 , 24069 , 50266 , 28400 , 23082 , 37206 , 2001 ]],
   [[25645 , 17084 , 34016 , 59341 , 11456 , 45334 , 49105 , 51152 , 28732 , 19538 , 41057 , 16648 , 37688 , 35108], [50490 , 24069 , 50266 , 28400 , 23082 , 37206 , 2001 , 25412 , 15092]],
   [[27970,41112,60828], [40324,9079]],
 [[1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 8 , 0 , 0 , 8 , 0 , 8],[5  ]],
   [[1],[1]],
   [[44799 , 38456 , 19937 , 26644 , 64297 , 27045 , 7707 , 34245 , 65210 , 23575 , 48636 , 8431 , 63625 , 2310 , 14050 , 18079 , 11684 , 24045],[13844 , 52861 , 14194 , 19205 , 65216 , 2517 , 63032 , 19326]],
[[ 38316 , 1817 , 28669 , 38797 , 61727 , 44431 , 41128 , 52948 , 6710 , 51434 , 39817 , 44060 , 57775 , 8980 , 20793], [ 33218 , 26942 , 40310 , 62821 , 28762 , 46691 , 54944 , 2041 , 22108 , 4336]],
[[], [ 50815 , 5485 , 61453 , 9075 , 29395 , 3211 , 1437]],
[[ 58126 , 43263 , 43723 , 22994 , 29159 , 47449 , 16924 , 1 , 63800 , 24597 , 59191 , 23379 , 6536], [ 1551 , 10062 , 12037 , 11523 , 38663 , 24061 , 51712 , 8170]],
  ].forEach(function(inputs){
    console_log('- - - - - - - - - s t a r t')
    var a = arr_to_int(inputs[0])
    var b = arr_to_int(inputs[1])
//    console_log('a', topolynom(a))
//    console_log('a id', a, memory.pointers[a], memory.values[a].ads[memory.pointers[a]])
//    console_log(dumpta(memory.values[a].ads, 50))
//    console_log(dumpta(memory.values[a].data, 50))
//    console_log('b', topolynom(b))
    var d = divide(a, b)
//    console_log('---')
//    console_log('a id', a, memory.pointers[a], memory.values[a].ads[memory.pointers[a]])
//    console_log(dumpta(memory.values[a].ads, 50))
//    console_log(dumpta(memory.values[a].data, 50))
//    console_log('q', topolynom( d[0]))
    var wat = multiply(d[0], b, temp)
    var c = add(wat, d[1])
    if ( ! equal(c, a) ) throw new Error('failed')
    memory.stacks.free(1)
    console_log('- - - - - - - - - e n d')
  })

var times = 100
while ( times-- > 0 ) {
  klara(100, props)
}




