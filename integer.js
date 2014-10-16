/*jshint asi:true, laxcomma:true*/
var console_log = console.log.bind(console)
var debug = require('./debug.js')

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var max = Math.max
var logn = Math.log
var floor = Math.floor
var ceil = Math.ceil
var LN2 = Math.LN2
var logn2_26 = logn(0x4000000)
var base      = 0x4000000
var half_base = 0x2000000

function Address(max, length){
  if ( (max) <= 256 ) {
    return new Uint8Array(length)
  } else if ( (max) < Math.pow(2, 16) ) {
    return new Uint16Array(length)
  } else if ( (max) < Math.pow(2, 25) ) {
    return new Uint32Array(length)
  } else if ( max >= Math.pow(2, 25) ) {
    // https://github.com/joyent/node/blob/857975d5e7e0d7bf38577db0478d9e5ede79922e/src/smalloc.h#L43
    throw new Error('Maximum size is 2^25 - 1. You gave: '+ max)
  }
}

function resize_address(arr, l, maxvalue){
  var length = pow(2, ceil(log(l) / LN2))
  var r = Address(maxvalue, length)
  r.set(arr)
  return r
}

function resize_data(ads, next, data, l){
  var new_ads = new ads.constructor(ads.length)
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / LN2))
  var r = new data.constructor(length)
  var ri = 1
  for ( var i = 1; i < next; i++ ) {
    var data_idx = ads[i]
    if ( data_idx !== 0 ) {
      var size = data[data_idx]
      new_ads[i] = ri
      for ( var j = 0; j < size; j++ ) {
        r[ri] = data[data_idx + j]
        ri++
      }
    }
  }
  return { data: r, brk: ri, ads: new_ads }
}

var heap, adrs

function Stack(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index.
  var next = 1 // this is the next address index.
  heap = new type(size)
  adrs = Address(size, size)

  function alloc(length){
    // there is no check for it but length has to be larger than 0
    if ( length > unallocated ) {
      extend(length)
    }
    unallocated -= length
    // save data index to data_idx and advance the break point with length
    var data_idx = brk
    brk = brk + length
    // save data_idx in address space and advance next
    var pointer = next++
    adrs[pointer] = data_idx
    heap[data_idx] = length
    return pointer
  }

  function free(pointer){
    if ( pointer === 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    unallocated += brk - adrs[pointer]
    brk = adrs[pointer]
    next = pointer
  }

  function extend(needed){
    var cl  = heap.length
    var nl = max(cl * 2, cl - unallocated + needed)
    if ( nl >= Math.pow(2, adrs.BYTES_PER_ELEMENT) ) {
      //console_log('resize address in extend')
      adrs = resize_address(adrs, adrs.length * 2, nl)
    }
    //console_log('resize heap in extend')
    var update = resize_data(adrs, next, heap, nl)
    heap = update.data
    adrs = update.ads
    brk = update.brk
    unallocated = heap.length - brk - 1
  }

  return { alloc: alloc , free: free, heap: function(i){ return heap[i] }, adrs: function(i){return adrs[i]} }

}

var stack = Stack(Uint32Array, 1, false)

var zero = stack.alloc(2)
heap[adrs[zero] + 1] = 0

var one = stack.alloc(3)
heap[adrs[one] + 1] = 0
heap[adrs[one] + 2] = 1

var β  = stack.alloc(4)
heap[adrs[β] + 1] = 0
heap[adrs[β] + 2] = 0
heap[adrs[β] + 3] = 1

function to_int(num){
  if ( num === 0 ) return zero
  if ( num === 1 ) return one
  if ( num === 0x4000000 ) return β

  var size_r = 3 + floor(logn(num) / logn2_26)

  var R = stack.alloc(size_r)
  var Rp = adrs[R]
  heap[Rp + 1] = 0 // type integer
  for ( var i = 2; i < size_r; i++ ) {
    heap[Rp + i] = num & 0x3ffffff
    num = num >>> 26
  }
  return R
}

function arr_to_int(arr){
  var R = stack.alloc( arr[0] )
  var Rp = adrs[R]
  for( var i = 1; i < arr.length; i++ ) {
    heap[Rp + i] = arr[i]
  }
  return R
}

function int_to_arr(I){
  var arr = []
  var Ip = adrs[I]
  var size = heap[Ip]
  for ( var i = 0; i < size; i++ ) {
    arr[i] = heap[Ip + i]
  }
  return arr
}

function int_size(I){
  return heap[adrs[I]]
}

function add(A, B){

  if ( heap[adrs[A]] > heap[adrs[B]] ) {
    var T = A
    A = B
    B = T
  }

  var size_a = heap[adrs[A]]
  var size_b = heap[adrs[B]]

  var size_r = size_b + 1
  var R = stack.alloc(size_r)
  var Rp = adrs[R]
  heap[Rp + 1] = 0 // type integer
  heap[Rp + size_r - 1] = 0 // possible garbage cleanup

  var Ap = adrs[A]
  var Bp = adrs[B]

  var carry = 0
  var partial = 0

  for ( var i = 2; i < size_a; i ++ ) {
    partial = heap[Ap + i] + heap[Bp + i] + carry
    heap[Rp + i] = partial & 0x3ffffff
    carry = partial >>> 26
  }

  for ( ; i < size_b; i ++ ) {
    partial = heap[Bp + i] + carry
    heap[Rp + i] = partial & 0x3ffffff
    carry = partial >>> 26
  }

  if ( carry ) {
    heap[Rp + i] += carry
  } else {
    heap[Rp] = heap[Rp] - 1
  }

  return R
}

function subtract(A, B){

  var comp = compare_abs(A, B)
  if ( comp === 0 ) {
    return zero
  } else if ( comp < 0 ) {
    var T = A
    A = B
    B = T
  }

  var size_r = heap[adrs[A]]

  var R = stack.alloc(size_r)
  var Rp = adrs[R]

  var Ap = adrs[A]
  var Bp = adrs[B]

  var size_a = heap[Ap]
  var size_b = heap[Bp]

  heap[Rp + 1] = 0 // type integer

  var r = 0
  var carry = 0

  for ( var i = 2; i < size_b; i ++ ) {
    r = heap[Ap + i] - heap[Bp + i] - carry
    if ( r < 0 ) {
      r += 0x4000000
      carry = 1
    } else {
      carry = 0
    }
    heap[Rp + i] = r
  }
  for ( ; i < size_a; i ++ ) {
    r = heap[Ap + i] - carry
    if ( r < 0 ) {
      heap[Rp + i] = r + 0x4000000
      carry = 1
    } else {
      heap[Rp + i] = r
      carry = 0
    }
  }
  heap[Rp + i] -= carry

  var trailing_zeroes = 0
  while ( heap[Rp + (--i)] === 0 && i > 1) {
    trailing_zeroes++
  }
  if ( trailing_zeroes ) heap[Rp] = size_r - trailing_zeroes

  return R
}

function multiply(A, B) {

  var size_a = heap[adrs[A]]
  var size_b = heap[adrs[B]]

  // header(2 blocks) is in both, so has to be removed
  var size_r = size_a + size_b - 2
  var R = stack.alloc(size_r) 
  var Rp = adrs[R]
  var Ap = adrs[A]
  var Bp = adrs[B]

  heap[Rp + 1] = 0 // type integer
  for ( var ii = 2; ii < size_r; ii++ ) heap[Rp + ii] = 0 // get rid of garbage

  var tj = 0
  var c = 0
  var n = 0

  for ( var i = 2; i < size_a; i++ ) {
    var a = heap[Ap + i]
    n = 0
    for ( var j = 2; j < size_b; j++ ) {
      c = n
      tj = a * heap[Bp + j] + heap[Rp + i + j - 2] + c
      heap[Rp + i + j - 2] = tj & 0x3ffffff
      n = (tj / 0x4000000) | 0
    }
    heap[Rp + i + size_b - 2] = n
  }

  var trailing_zeroes = 0
  var k = size_a + size_b - 3 + Rp
  while ( k > Rp + 2 && heap[k] === 0) {
    k--
    trailing_zeroes++
  }

  var size_r = size_a + size_b - trailing_zeroes - 2
  if ( trailing_zeroes ) heap[Rp] = size_r

  return R
}

function left_shift(I, n){
  if ( equal(I, zero) ) return zero
  var words = (n / 26) | 0
  var bits = n % 26
  var offset_bits = 26 - bits

  var size_i = heap[adrs[I]]

  // size of the returned bigint will be the size of the input + the number of words it will be
  // extended with
  // and depending on the most significant bigit's size 1 or 0 more
  var msdi = heap[adrs[I] + size_i - 1]
  var bits_word = ((msdi * Math.pow(2,bits)) > 0x3ffffff ? 1 : 0)
  var R = stack.alloc(size_i + words + bits_word)
  var Rp = adrs[R]
  heap[Rp + 1] = 0 // type integer

  var Ip = adrs[I]

  // clean possible garbage
  for ( var i = 2; i < words + 2; i++ ) {
    heap[Rp + i] = 0
  }

  if ( bits > 0 ) {
    var carry = 0
    for ( var j = 2; j < size_i; j++ ) {
      heap[Rp + words + j] = (carry + (heap[Ip + j] << bits)) & 0x3ffffff
      carry = heap[Ip + j] >>> offset_bits
    }
    heap[Rp + words + j] = carry

  } else {
    for ( var i = 2; i < size_i; i++ ) {
      heap[Rp + words + i] = heap[Ip + i]
    }
  }
  return R
}

function right_shift(I, n){
  if ( n === 0 ) return I
  var words = (n / 26) | 0 
  var bits = n % 26
  var offset_bits = 26 - bits

  var size_i = heap[adrs[I]]
  if ( size_i === 2 ) return zero

  var most_significant_bigit_i = heap[adrs[I] + size_i - 1]
  var bit_offset = ( most_significant_bigit_i >>> bits ? 0 : 1)
  var size_r = size_i - words - bit_offset 
  if ( size_r < 2 ) throw new Error('you shifted so much to the right, you came back on the left!')

  var R = stack.alloc(size_r)
  var Rp = adrs[R]
  heap[Rp + 1] = 0 // type integer

  var Ip = adrs[I]

  for ( var j = 2 + words, i = 2; j < size_i ; j++, i++ ) {
    heap[Rp + i] = ((heap[Ip + j] >>> bits) + ( j + 1 < size_i ? heap[Ip + j + 1] << offset_bits : 0)) & 0x3ffffff
  }

  var trailing_zeroes = 0
  var k = Rp + size_r - 1
  while ( k > Rp + 2 && heap[k] === 0) {
    k--
    trailing_zeroes++
  }

  if ( trailing_zeroes ) heap[Rp] = size_r - trailing_zeroes
  return R
}

function sub(A, B){
  var size_b = heap[adrs[B]]
  var BR = stack.alloc(size_b + 1)
  var Bp = adrs[B]
  var BRp = adrs[BR]
  heap[BRp + 1] = 0 // type integer
  heap[BRp + 2] = 0 // some garbage might be there

  // left shifting: multiply B with β
  for ( var i = 2; i < size_b; i++ ) {
    heap[BRp + i + 1] = heap[Bp + i]
  }

  if ( compare_abs(A, BR) >= 0  ) {
    var C = subtract(A, BR)
    var t = divide(C, B)
    return [add(t[0], β), t[1]]
  }

  var Ap = adrs[A]
  var size_a = heap[Ap]
  //TODO: this to be removed
  if ( size_a < 4 ) {
    print('a', A)
    throw new Error('size too small')
  }
  var q = floor((base * heap[Ap + size_a - 1] + heap[Ap + size_a - 2]) / heap[adrs[B] + size_b - 1])

  if ( q > base - 1 ) q = base - 1
  var Q = stack.alloc(3)
  var Qp = adrs[Q]
  heap[Qp + 1] = 0 // type integer
  heap[Qp + 2] = q // value

  var T = multiply(Q, B)
  var corrected = false
  if ( compare_abs(T, A) > 0 ) {
    q = q - 1
    var T = subtract(T, B)
    corrected = true
  }
  if ( compare_abs(T, A) > 0 ) {
    q = q - 1
    var T = subtract(T, B)
  }
  if ( corrected ) {
    var Q = stack.alloc(3)
    var Qp = adrs[Q]
    heap[Qp + 1] = 0 // type integer
    heap[Qp + 2] = q // value
  }
  return [Q, subtract(A, T)] 
}

function divide(A, B){
  var Bp = adrs[B]
  var size_b = heap[Bp]
  var most_significant_digit_b = heap[Bp + size_b - 1]
  if ( most_significant_digit_b < half_base ) {

    var shifted = ceil(logn(half_base / most_significant_digit_b) / LN2) 
    var As = left_shift(A, shifted)
    var Bs = left_shift(B, shifted)

    var Asp = adrs[As]
    var m = heap[adrs[Asp]]

    var Bsp = adrs[Bs]
    var n = heap[adrs[Bsp]]

    if ( m < n ) {
      return [zero, A]
    }

    if ( m === n ) {
      var c = compare_abs(As, Bs)
      if ( c < 0 ) return [zero, A]
      if ( c === 0 ) return [one, zero]
      return [one, subtract(A, B)]
    }

    if ( m === n + 1 ) {
      var qr = sub(As, Bs)
      return [qr[0], right_shift(qr[1], shifted)]
    }

    var powerdiff = (m - n - 1) * 26
    var A_p = right_shift(As, powerdiff)
    var t3 = sub(A_p, Bs)
    var t4 = divide(add(left_shift(t3[1], powerdiff), subtract(As, left_shift(A_p, powerdiff))), Bs)

    return [add(left_shift(t3[0], powerdiff), t4[0]), right_shift(t4[1], shifted)]

  } else {

    var Ap = adrs[A]
    var m = heap[adrs[Ap]]

    var Bp = adrs[Bp]
    var n = heap[adrs[Bp]]

    if ( m < n ) {
      return [zero, A]
    }

    if ( m === n ) {
      var c = compare_abs(A, B)
      if ( c < 0 ) return [zero, A]
      if ( c === 0 ) return [one, zero]
      return [one, subtract(A, B)]
    }

    if ( m === n + 1 ) {
      return sub(A, B)
    }

    var powerdiff = (m - n - 1) * 26
    var A_p = right_shift(A, powerdiff)

    var t3 = sub(A_p, B)
    var t4 = divide(add(left_shift(t3[1], powerdiff), subtract(A, left_shift(A_p, powerdiff))), B)

    return [add(left_shift(t3[0], powerdiff), t4[0]), t4[1]]
  }
}


function compare_abs(A, B){
  if ( A === B ) return 0
  var Ap = adrs[A]
  var Bp = adrs[B]

  var a_size = heap[Ap]
  var b_size = heap[Bp]

  if ( a_size < b_size ) {
    return -1
  } else if ( b_size < a_size ) {
    return 1
  } else {
    for ( var i = a_size - 1; i > 1; i-- ) {
      if ( heap[Ap + i] < heap[Bp + i] ) {
        return -1
      } else if ( heap[Ap + i] > heap[Bp + i] ) {
        return 1
      }
    }
    return 0
  }
}

function equal(A, B){
  if ( A === B ) return true
  var Ap = adrs[A]
  var size_a = heap[Ap]

  var Bp = adrs[B]
  var size_b = heap[Bp]

  if ( size_a !== size_b ) return false
  for ( var i = 1; i < size_a; i++ ) {
    if ( heap[Ap + i] !== heap[Bp + i] ) return false
  }
  return true
}

var tenM = to_int(10000000)
var pot = [one, tenM]

function power_of_ten(i){
  if ( pot[i] !== null ) return pot[i]
  for ( var k = pot.length; k <= i; k++ ) {
    pot[k] = multiply(pot[k - 1], tenM) 
  }
  return pot[i]
}

//pot = pot.concat(Array.apply(null, Array(69)).map(function(_, i){return power_of_ten(i + 2)}))

//console.log('size of heap and adrs', heap.length, adrs.length)

function parse_base10(str){
  var r = zero
  var i = 0
  while ( str.length ) {
    r = i === 0 ? to_int(Number(str.slice(-7)))
      :           add(r, multiply(to_int(Number(str.slice(-7))), power_of_ten(i)))
    str = str.slice(0, -7)
    i++
  }
  return r
}

function to_base10(bigint){
  var dec = []
  while( compare(bigint, ten) >= 0 ) {
    var r = divide(bigint, ten)
    var rem = r[1]
    var remp = adrs[rem]
    var digit = heap[remp] > 2 ? heap[remp + 2] + '' : ''

    dec.push(Array(8 - digit.length).join('0') + digit)
    bigint = r[0]
  }
  var bigintp = adrs[bigint]
  digit = heap[bigintp] > 2 ? heap[bigintp + 2] + '' : ''
  dec.push(digit)
  return dec.reverse().join('')
}

function clone(I){
  var size = heap[adrs[I]]
  var C = stack.alloc(size)
  var Ip = adrs[I]
  var Cp = adrs[C]

  for ( var i = 1; i < size; i++ ) {
    heap[Cp + i] = heap[Ip + i]
  }

  return C
}

function print(name, I){
  var v = []
  var guard = 1000
  var Ip = adrs[I]
  var size = heap[Ip]
  if ( size < 2 ) {
    //console_log( name, I, Ip, size)
    throw new Error('size should never be less than 2')
  }
  for ( var j = 0; j < size; j++ ) {
    v.push(heap[Ip + j])
    if ( ! (--guard) ) throw new Error('safeguard. number is larger than 1000 digits OR corrupted memory')
  }

  return console_log(name, v.join(', '))
  //return console_log('[', v.join(' , '), ']')
}

//global.print = print


function compare(A, B){
  var signA = ( heap[adrs[A] + 1] & 1 ) 
  var signB = ( heap[adrs[B] + 1] & 1 ) 
  return signA + signB === 0   ? signA < signB 
       : /* same sign */   compare_abs(A, B) 
}

function addition(A, B){

  var Ap = adrs[A]
  if ( heap[Ap] === 2 ) return B 
  var signA = ( heap[Ap + 1] & 1 ) 

  var Bp = adrs[B]
  if ( heap[Bp] === 2 ) return A 
  var signB = ( heap[Bp + 1] & 1 ) 

  if ( signA === signB ) {
    //console.log(6.1)
    var R = add(A, B)
  } else {
    if ( compare_abs(A, B) === -1 ) {
      var T = A
      A = B
      B = T
      T = signA
      signA = signB
      signB = T
    }
    var R = subtract(A, B)
  }

  var Rp = adrs[R]
  if ( heap[Rp] > 2 ) {
    heap[Rp + 1] = signA
  }

  return R
}

function subtraction(A, B){
  if ( heap[adrs[B]] === 2 ) return A
  var subtrahend = clone(B)
  var signB = ( heap[adrs[B] + 1] & 1 ) 
  heap[adrs[subtrahend] + 1] = signB ? 0 : 1
  
  return heap[adrs[A]] === 2 ? subtrahend : addition(A, subtrahend)
}

function multiplication(A, B){
  if ( equal(A, zero) || equal(B, zero) ) return zero
  var R = multiply(A, B)
  heap[adrs[R] + 1] = ( heap[adrs[A] + 1] & 1 ) ^ ( heap[adrs[B] + 1] & 1 )
  return R
}

function division(A, B){
  if ( equal(B, one) ) return [A, zero]
  if ( equal(B, zero) ) throw new Error('can\'t divide with zero')
  if ( equal(A, zero) ) return [zero, zero]
  if ( compare_abs(A, B) === -1 ) return [zero, A]
  var R = divide(A, B)
  var signA = ( heap[adrs[A] + 1] & 1 )
  var signB = ( heap[adrs[B] + 1] & 1 )
  var qp = adrs[R[0]]
  var rp = adrs[R[1]]
  heap[qp + 1] = (heap[qp] > 2) & (signA ^ signB)
  heap[rp + 1] = (heap[rp] > 2) & signA
  return R
}

function parse(str){
  str = str.trim()
  if ( ! /^[\+-]?[0-9]+$/.test(str) ) throw new Error('not a valid base10')
  if ( str[0] === '+' ) {
    var s = 0
    str = str.slice(1)
  } else if ( str[0] === '-' ) {
    var s = 1
    str = str.slice(1)
  } else {
    var s = 0
  }
  
  var x = parse_base10(str)
  heap[adrs[x] + 1] = s
  return x
}

function to_dec(I){
  if ( equal(zero, I) ) return '0'
  var string = to_base10(I)
  if ( heap[adrs[I] + 1] ) string = '-' + string
  return string
}

function abs(I){
  var R = clone(I)
  if ( heap[adrs[R] + 1] ) {
    heap[adrs[R] + 1] = 0
  }
  return R
}

function negate(I){
  var R = clone(I)
  var Rp = adrs[R]
  heap[Rp + 1] = heap[Rp + 1] ? 0 : 1
  return R
}

function gcd(a, b){
  // TODO: clear used memory
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

var arb = {
  add : addition
, subtract : subtraction
, multiply : multiplication
, divide : division
, parse : parse
, to_dec : to_dec
, to_int : to_int
, arr_to_int : arr_to_int
, int_to_arr : int_to_arr
, int_size : int_size
, gcd : gcd
, lcm : lcm
, negate : negate
, abs : abs
, one : one
, zero : zero
, compare_abs : compare_abs
, compare : compare
, equal : equal
, memory : stack
, print : print
, clone : clone
}

module.exports = arb

