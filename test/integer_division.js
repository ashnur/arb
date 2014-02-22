void function(){
  'use strict'
  var divide = require('../integer_division.js')
  var add = require('../integer_addition.js')
  var multiply = require('../integer_multiplication.js')
  var equal = require('../integer_equality.js')
  var type = require('../type.js')
  var sign = require('../sign.js')
  var div = require('../integer_division.js')
  var rand_int = require('./helpers/rand_int.js')

  var claire = require('claire')
  var check = claire.check
  var as_generator = claire.asGenerator
  var dividend = as_generator(rand_int.static_generator([0,100], 'complex', 'positive'))
  var divisor = as_generator(rand_int.static_generator([1,100], 'complex', 'positive'))
  var klara = require('./claire-helpers/klara.js')
  var analyzer = require('./claire-helpers/analyzer.js')
  var log = console.log.bind(console)
  var print = require('./helpers/print_int.js')


  function back_substitution(dividend, divisor){
//    print('dividend', dividend)
//    print('divisor', divisor)

    var result = divide(dividend, divisor)
    var quotient = result[0]
    var remainder = result[1]
//    print('q', quotient)
//    print('r', remainder)

    var r = add(multiply(quotient, divisor), remainder)
//    print('c', r)
    return equal(dividend, r)
  }

  var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

  var props = [
    { title : 'back_substitution'
    , fn: back_substitution
    , args: [dividend, divisor]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer)
    }
  ,
  ]

//  function arr_to_int(arr){
//    var pool = require('../pool.js')
//    var I = pool('integer', arr.length)
//    for ( var i = 0; i < arr.length; i++ ) {
//      I[i + 2] = arr[i]
//    }
//    return I
//  }
//
//  var to_int = require('../primitive_to_int.js')
//  var a = arr_to_int([9,7])
//  var b = arr_to_int([4])
//  print('a', a)
//  print('b', b)
//  var d = divide(a, b)
//  print('q', d[0])
//  print('r', d[1])
//  var c = add(multiply(d[0], b), d[1])
//  print('c', c)
//  if ( ! equal(c, a) ) log('failed')



  klara(100, props)

}()
