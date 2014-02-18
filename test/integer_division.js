void function(){
  'use strict'
  var divide = require('../integer_division.js')
  var add = require('../integer_addition.js')
  var multiply = require('../integer_multiplication.js')
  var equal = require('../integer_equality.js')
  var test = require('tape')
  var pool = require('../pool.js')
  var type = require('../type.js')
  var sign = require('../sign.js')
  var div = require('../integer_division.js')
  var rand_int = require('./rand_int.js')

  var claire = require('claire')
  var check = claire.check
  var for_all = claire.forAll
  var as_generator = claire.asGenerator
  var arb_int = as_generator(rand_int.positive)

  function back_substitution(dividend, divisor){
    var result = divide(dividend, divisor)
    var quotient = result[0]
    var remainder = result[1]
    return equal(dividend, add(multiply(quotient, divisor), remainder))
  }

  function check_property(property){
    test(property.title, function(t){
      var results = check(300, property.checks)
      results.failed.forEach(function(result){
        if (result.value.stack) console.log(result.value.stack)
        t.fail('==> '+ results.passed.length+' passed, '+', 1 failed with arguments: ' + JSON.stringify(result.arguments))
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }

  ;[

  { title : 'back_substitution'
    , checks: for_all(arb_int, arb_int).satisfy(back_substitution)
    }
  ,
  ].forEach(check_property)

}()
