void function(){
  var add = require('../integer_addition.js')
  var subtract = require('../integer_subtraction.js')
  var rand_int = require('./rand_int.js')
  var test = require('tape')
  var claire = require('claire')
  var for_all = claire.forAll
  var check = claire.check
  var as_generator = claire.asGenerator
  var equal = require('../integer_equality.js')
  var liberate = require('liberate')
  var slice = liberate(Array.prototype.slice)
  var every = liberate(Array.prototype.every)
  var join = liberate(Array.prototype.join)
  var bitarr = require('bit-array')
  var pool = require('../pool.js')
  var counter = 0
  var log = console.log.bind(console)
  var rand = require('random-number')

  function print(n, arr){
    return n+' '+join(arr, ', ')
  }

  function subtract_sum(n, m, k){
    var mk = add(m, k)
    var a = subtract(n, mk)
    var b = subtract(subtract(n, m), k)
    var r = equal(a, b)
    return r
  }

  function add_difference(n, m, k){
    var x = subtract(m, k)
    var a = add(n, x)
    var y = add(n, m)
    var b = subtract(y, k)
    var r = equal(a, b)
    return r
  }

  function subtract_difference(n, m, k){
    var a = subtract(n, subtract(m, k))
    var b = add(subtract(n, m), k)
    return equal(add(a, b), add(b, a))
  }

  function check_property(property){
    test(property.title, function(t){
      var results = check(1000, property.checks)
      results.failed.forEach(function(result){
        t.fail('==> '+ results.passed.length+' passed, '+', 1 failed with arguments: ' + JSON.stringify(result.arguments))
      })
      if ( results.failed.length == 0 ) {
        t.pass(results.passed.length+' passed, '+results.ignored.length+' ignored')
      }
      t.end()
    })
  }

  ;[{ title : 'subtract_sum'
    , fn  : subtract_sum
    , checks: for_all(as_generator(rand_int.generator_of_size(19,29,0))
                    , as_generator(rand_int.generator_of_size(1,9,0))
                    , as_generator(rand_int.generator_of_size(1,9,0))
                    ).satisfy(subtract_sum)
    }
  , { title : 'add_difference'
    , fn  : add_difference
    , checks: for_all(as_generator(rand_int.generator_of_size(1,100,0))
                    , as_generator(rand_int.generator_of_size(10,19,0))
                    , as_generator(rand_int.generator_of_size(1,9,0))
                    ).satisfy(add_difference)
    }
  , { title : 'subtract_difference'
    , fn  : subtract_difference
    , checks: for_all(as_generator(rand_int.generator_of_size(20,29,0))
                    , as_generator(rand_int.generator_of_size(10,19,0))
                    , as_generator(rand_int.generator_of_size(1,9,0))
                    ).satisfy(subtract_difference)
    }
  ].forEach(check_property)

}()
