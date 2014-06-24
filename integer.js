void function(){
  'use strict'

  var add = require('./integer_addition.js')
  var pool = require('./pool.js')
  var subtract = require('./integer_subtraction.js')
  var multiply = require('./integer_multiplication.js')
  var divide = require('./integer_division.js')
  var one = require('./one.js')
  var zero = require('./zero.js')
  var compare_abs = require('./integer_compare_abs.js')
  var equal = require('./integer_equality.js')
  var sign = require('./sign.js')
  var parse_base10 = require('./parse_base10.js')
  var to_base10 = require('./to_base10.js')

  function compare(a, b){
    var na = sign.read(a) ? -1 : 1
    var nb = sign.read(b) ? -1 : 1
// console.log(na, nb)
// console.log(!!na ^ !!nb,  na < nb ? -1 : 1)
// console.log(compare_abs(a, b) * (na || 1))
    return equal(zero, a) && equal(zero, b) ? 0
         : !(na + nb)                       ? na < nb ? -1 : 1
         : /* same sign */                    compare_abs(a, b) * (na || 1)

  }

  function addition(a, b){
    if ( equal(a, zero) ) return b
    if ( equal(b, zero) ) return a
    if ( sign.read(a) == sign.read(b) ) {
      var r = add(a, b)
    } else {
      if ( compare_abs(a, b) == -1 ) {
        var t = a
        a = b
        b = t
      }
      var r = subtract(a, b)
    }

    if ( r[1] ) {
      var tr = sign.change(r, sign.read(a))
      return tr
    }
    return r
  }

  function subtraction(a, b){
    if ( equal(b, zero) ) return a
    if ( equal(a, b) ) return zero
    var subtrahend = b
    if ( b[1] ) {
      var tsh = sign.change(subtrahend, sign.read(b) ? false : true)
      subtrahend = tsh
    }
    if ( equal(a, zero) ) { return subtrahend }
    return addition(a, subtrahend)
  }

  function multiplication(a, b){
    if ( equal(a, one) ) return b
    if ( equal(b, one) ) return a
    if ( equal(a, zero) || equal(b, zero) ) return zero
    var r = multiply(a, b)
    var tr = sign.change(r, sign.read(a) ^ sign.read(b))
    return tr
  }

  function division(a, b){
    if ( equal(b, one) ) return [a, zero]
    if ( equal(a, zero) ) return [zero, zero]
    if ( compare_abs(a, b) == -1 ) return [zero, a]
    if ( equal(b, zero) ) throw new Error('can\'t divide with zero')
    var r = divide(a, b)
    return [sign.change(r[0], sign.read(a) ^ sign.read(b))
          , sign.change(r[1], sign.read(a) ^ sign.read(b))]
  }

  function parse(str){
    str = str.trim()
    if ( ! /^[\+-]?[0-9]+$/.test(str) ) throw new Error('not a valid base10')
    if ( str[0] == '+' ) {
      var s = 0
      str = str.slice(1)
    } else if ( str[0] == '-' ) {
      var s = 1
      str = str.slice(1)
    } else {
      var s = 0
    }
    return sign.change(parse_base10(str), s)
  }

  function to_dec(integer){
    if ( equal(zero, integer) ) return '0'
    var string = to_base10(integer)
    if ( sign.read(integer) ) string = '-' + string
    return string
  }

  function abs(integer){
    var v = integer
    if ( sign.read(integer) ) {
      return sign.change(v, 0)
    }
    return v
  }

  function negate(integer){
    return sign.change(integer, sign.read(integer) ? false : true)
  }

  function gcd(a, b){
    var t
    var A = abs(a)
    var B = abs(b)
    while ( compare_abs(B, zero) > 0 ) {
        t = B
        B = division(A, B)[1]
        A = t
    }
    return A
  }

  function lcm(a, b){
    return division(abs(multiplication(a, b)), gcd(a,b))
  }


  var arb = {}

  arb.add = addition
  arb.subtract = subtraction
  arb.multiply = multiplication
  arb.divide = division

  arb.parse = parse
  arb.to_dec = to_dec

  arb.gcd = gcd
  arb.lcm = lcm

  arb.negate = negate
  arb.abs = abs

  arb.one = one
  arb.zero = zero

  arb.compare_abs = compare_abs
  arb.compare = compare

  arb.equal = equal


  module.exports = arb

}()
