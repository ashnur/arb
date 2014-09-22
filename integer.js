var memory = require('./memory.js')
var values = memory.values
var pointers = memory.pointers
var temp = memory.temp
var numbers = memory.numbers

var add = require('./integer_addition.js')
var subtract = require('./integer_subtraction.js')
var multiply = require('./integer_multiplication.js')
var divide = require('./integer_division.js')

var one = require('./one.js')
var zero = require('./zero.js')

var compare_abs = require('./integer_compare_abs.js')
var equal = require('./integer_equality.js')
var parse_base10 = require('./parse_base10.js')
var to_base10 = require('./to_base10.js')
var clone = require('./integer_clone.js')

var print = require('./print.js')

function compare(a, b){

  if (equal(zero, a) && equal(zero, b)) return 0

  var t_a = values[a]
  data_a = t_a.data
  didx_a = t_a.ads[pointers[a]]
  var na = ( data_a[didx_a + 1] & 1 ) 

  var t_b = values[b]
  data_b = t_b.data
  didx_b = t_b.ads[pointers[b]]
  var nb = ( data_b[didx_b + 1] & 1 ) 

  return !(na + nb)       ? na < nb 
       : /* same sign */    compare_abs(a, b) * (na || 1)

}

function addition(a, b){
  if ( equal(a, zero) ) return b
  if ( equal(b, zero) ) return a

  var t_a = values[a]
  data_a = t_a.data
  didx_a = t_a.ads[pointers[a]]
  var na = ( data_a[didx_a + 1] & 1 ) 

  var t_b = values[b]
  data_b = t_b.data
  didx_b = t_b.ads[pointers[b]]
  var nb = ( data_b[didx_b + 1] & 1 ) 
  if ( na == nb ) {
    var r = add(a, b)
  } else {
    if ( compare_abs(a, b) == -1 ) {
      var t = a
      a = b
      b = t
      t = na
      na = nb
      nb = t
    }
    var r = subtract(a, b)
  }

  var t_r = values[r]
  data_r = t_r.data
  didx_r = t_r.ads[pointers[r]]
  if ( data_r[didx_r] > 2 ) {
    data_r[didx_r + 1] = na
  }

  return r
}

function subtraction(a, b){
  if ( equal(b, zero) ) return a
  if ( equal(a, b) ) return zero
  var a_is_zero = false
  if ( equal(a, zero) ) { a_is_zero = true }
  var subtrahend = clone(b, a_is_zero ? numbers : temp)

  var t_b = values[b]
  data_b = t_b.data
  didx_b = t_b.ads[pointers[b]]
  var nb = ( data_b[didx_b + 1] & 1 ) 

  var t_s = values[subtrahend]
  data_s = t_s.data
  didx_s = t_s.ads[pointers[subtrahend]]
  data_s[didx_s + 1] = nb ? 0 : 1
  
  return a_is_zero ? subtrahend : addition(a, subtrahend)
}

function multiplication(a, b){
  if ( equal(a, one) ) return b
  if ( equal(b, one) ) return a
  if ( equal(a, zero) || equal(b, zero) ) return zero
  var r = multiply(a, b)

  var t_a = values[a]
  var t_b = values[b]
  var t_r = values[r]

  t_r.data[t_r.ads[pointers[r]] + 1] = ( t_a.data[t_a.ads[pointers[a]] + 1] & 1 ) ^ ( t_b.data[t_b.ads[pointers[b]] + 1] & 1 )

  return r
}

function division(a, b){
  if ( equal(b, one) ) return [a, zero]
  if ( equal(a, zero) ) return [zero, zero]
  if ( compare_abs(a, b) == -1 ) return [zero, a]
  if ( equal(b, zero) ) throw new Error('can\'t divide with zero')
  var r = divide(a, b)

  var t_a = values[a]
  var na = ( t_a.data[t_a.ads[pointers[a]] + 1] & 1 )

  var t_b = values[b]
  var nb = ( t_b.data[t_b.ads[pointers[b]] + 1] & 1 )

  var t_q = values[r[0]]
  t_q.data[t_q.ads[pointers[r[0]]] + 1] = na ^ nb

  var t_r = values[r[1]]
  t_r.data[t_r.ads[pointers[r[1]]] + 1] = na

  return r
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
  
  var x = parse_base10(str)
  var t_x = values[x]
  t_x.data[t_x.ads[pointers[x]] + 1] = s
  return x
}

function to_dec(integer){
  if ( equal(zero, integer) ) return '0'
  var string = to_base10(integer)
  var t_integer = values[integer]
  if ( t_integer.data[t_integer.ads[pointers[integer]] + 1] ) string = '-' + string
  return string
}

function abs(integer){
  var v = integer
  var t_integer = values[integer]
  if ( t_integer.data[t_integer.ads[pointers[integer]] + 1] ) {
    t_integer.data[t_integer.ads[pointers[integer]] + 1] = 0
  }
  return v
}

function negate(integer){
  integer = clone(integer)
  var t_integer = values[integer]
  var data_integer = t_integer.data
  var didx_integer = t_integer.ads[pointers[integer]]
  data_integer[didx_integer + 1] = data_integer[didx_integer + 1] ? 0 : 1
  return integer
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

arb.memory = memory


module.exports = arb

