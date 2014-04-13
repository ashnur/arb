void function(){
  'use strict'
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

  var claire = require('claire')
  var check = claire.check
  var as_generator = claire.asGenerator
  var dividend = as_generator(rand_int.static_generator([2,2], 'complex', 'positive'))
  var divisor = as_generator(rand_int.static_generator([1,1], 'complex', 'positive'))
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
 // log(compare(dividend, divisor))
    if ( compare(dividend, divisor) >= 0 ) {
      // normal eset, dividend a nagyobb, osztunk
      var r = add(multiply(quotient, divisor), remainder)
  //    print('c', r)
      return equal(dividend, r)
    } else {
      // divisor a nagyobb, 0 eredmeny, divisor a maradek
      // print('quotient', quotient)
//  log('q == 0' , equal(quotient, zero))
//        print('dividend', dividend)
//        print('r', remainder)
//  log('remainder == dividend' , equal(remainder, dividend))
      return equal(quotient, zero) && equal(dividend, remainder)
    }

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

  function arr_to_int(arr){
    var pool = require('../pool.js')
    var I = pool('integer', arr.length)
    for ( var i = 0; i < arr.length; i++ ) {
      I[i + 2] = arr[i]
    }
    return I
  }

  function to_poly(arr){
    var r = []
    for ( var i = 2; i < arr.length; i++ ) {
      r.push(arr[i] + ' * 65536^' +(i-2))
    }
    log('a', r.join(' + '))
  }

//  var to_int = require('../primitive_to_int.js')
//  var a = arr_to_int([51736,18791,9178,18928,57606,50427])
//  var b = arr_to_int([65034,991,  2196,44177,13404])
//  var a = arr_to_int([57130,23618])
//  var b = arr_to_int([8])
//  print('a', a)
//  print('b', b)
//  var d = divide(a, b)
//  print('q', d[0])
//  print('r', d[1])
//  var c = add(multiply(d[0], b), d[1])
//  print('c', c)
//  if ( ! equal(c, a) ) log('failed')
//  to_poly(a)
//  to_poly(b)
//  to_poly(d[0])
//  to_poly(d[1])



klara(50000, props)

}()
