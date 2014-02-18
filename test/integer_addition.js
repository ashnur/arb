void function(){
  var add = require('../integer_addition.js')
  var rand_int = require('./helpers/rand_int.js')
  var claire = require('claire')
  var as_generator = claire.asGenerator
  var arb_int = as_generator(rand_int.positive)
  var equal = require('../integer_equality.js')
  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var log = console.log.bind(console)
  var max = Math.max
  var zero = require('../zero.js')
  var klara = require('./claire-helpers/klara.js')
  var analyzer = require('./claire-helpers/analyzer.js')

  function print(n, arr){
    return log(n,join(arr, ', '))
  }

  function associativity(a, b, c){
    return equal(add(a, add(b, c)), add(add(a, b), c))
  }

  function commutativity(a, b){
    return equal(add(a, b), add(b, a))
  }

  function identity(a){
    return equal(add(a, zero), a)
  }

  var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')

  var props = [
    { title : 'identity'
    , fn: identity
    , args: [arb_int]
    , analyze: analyzer(bigint_analyzer)
    }
  , { title : 'commutativity'
    , fn: commutativity
    , args: [arb_int, arb_int]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer)
    }
  , { title : 'associativity'
    , fn: associativity
    , args: [arb_int, arb_int, arb_int]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, bigint_analyzer)
    }
  ]
  klara(1000, props)

}()
