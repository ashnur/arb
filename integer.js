void function(){
  'use strict'

  var pool = require('./pool.js')
  var add = require('./integer_addition.js')
  var subtract = require('./integer_subtraction.js')
  var multiply = require('./integer_multiplication.js')
  var divide = require('./integer_division.js')
  var one = require('./one.js')()
  var zero = require('./zero.js')()
  var compare = require('./integer_compare_abs.js')
  var equal = require('./integer_equality.js')
  var sign = require('./sign.js')


  function addition(a, b){
    if ( equal(a, zero) ) return b
    if ( equal(b, zero) ) return a
    if ( sign.read(a) == sign.read(b) ) {
      var r = add(a, b)
    } else {
      if ( compare(a, b) == -1 ) {
        var t = a
        a = b
        b = t
      }
      var r = subtract(a, b)
    }
    if ( r[1] ) sign.change(r, sign.read(a))
    return r
  }

  function subtraction(a, b){
    if ( equal(b, zero) ) return a
    if ( equal(a, b) ) return zero
    var subtrahend = pool('integer', b[1], b)
    if ( b[1] ) {
      sign.change(subtrahend, sign.read(b) ? false : true)
    }
    if ( equal(a, zero) ) { return subtrahend }
    return addition(a, subtrahend)
  }

  function multiplication(a, b){
    if ( equal(a, one) ) return b
    if ( equal(b, one) ) return a
    if ( equal(a, zero) || equal(b, zero) ) return zero
    var r = multiply(a, b)
    sign.change(r, sign.read(a)*sign.read(b))
    return r
  }

  function division(a, b){
    if ( equal(a, one) ) return b
    if ( equal(b, one) ) return a
    if ( equal(a, zero) ) return zero
  }

  function parse(){
  }

  function gcd(a, b){
  }

  function lcm(a, b){
  }

  module.exports = function(hash_string){
  }

  module.exports.add = addition
  module.exports.subtract = subtraction
  module.exports.multiply = multiplication
  module.exports.divide = division

}()