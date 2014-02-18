require("better-stack-traces").install({
  before: 2, // number of lines to show above the error
  after: 3, // number of lines to show below the error
  maxColumns: 80, // maximum number of columns to output in code snippets
  collapseLibraries: /node_modules/ // omit code snippets from paths that match the given regexp (ignores node_modules by default)
})
void function(){
  var add = require('../integer_addition.js')
  var addp = require('../integer_add_primitive.js')
  var rand_int = require('./helpers/rand_int.js')
  var claire = require('claire')
  var as_generator = claire.asGenerator
  var arb_int = as_generator(rand_int.positive)
  var arb_int = as_generator(rand_int('small', 'simple', 'positive'))
  var rn = require('random-number')
  var simple_numbers = rn.generator({min: 0, max: 9, integer: true})
  var large_numbers = rn.generator({min: 0, max: Math.pow(2,53), integer: true})
  var arb_primitive = as_generator(function(){return large_numbers()})
  var bygen = as_generator(function(){return simple_numbers()})
  var equal = require('../integer_equality.js')
  var liberate = require('liberate')
  var join = liberate(Array.prototype.join)
  var log = console.log.bind(console)
  var zero = require('../zero.js')
  var to_int = require('../primitive_to_int.js')
  var klara = require('./claire-helpers/klara.js')
  var left_pad = require('../left_pad.js')
  var analyzer = require('./claire-helpers/analyzer.js')

  function print(n, arr){
    return log(n, join(arr, ', '))
  }

  function associativity(a, b, c){
    var bc = addp(b, c)
    var ab = add(a, b)
    var a_bc = add(a, bc)
    var ab_c = addp(ab, c)
    return  equal(a_bc,ab_c )
  }

  function shift(A, P, by){
    return equal(add(A, left_pad(to_int(P), by)), addp(A, P, by))
  }

  var bigint_analyzer = require('./claire-helpers/analyze_bigint.js')
  var int_analyzer = require('./claire-helpers/analyze_int.js')

  var props = [
    { title : 'associativity'
    , fn: associativity
    , args:  [arb_int, as_generator(function(){ return zero}), arb_primitive]
    , analyze: analyzer(bigint_analyzer, bigint_analyzer, int_analyzer)
    }
  , { title : 'shift'
    , fn: shift
    , args: [arb_int, arb_primitive, bygen]
    , analyze: analyzer(bigint_analyzer, int_analyzer, int_analyzer)
    }
  ]

  klara(2000, props)
}()
