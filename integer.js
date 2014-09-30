/*jshint asi:true, laxcomma:false*/
var console_log = console.log.bind(console)

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

function resize(arr, l, maxvalue){
  
  var length = pow(2, ceil(log(l) / LN2))
  var r = Address(maxvalue, length)
  r.set(arr)
  return r
}

function resize_naive(ads, next, data, l){
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

function Naive(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index.
  var next = 1 // this is the next address index.

  var heap = {
    data: new type(size)
  , ads: Address(size, size)
  , alloc: alloc
  , free: free
  }

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
    if ( pointer === heap.ads.length ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    if ( heap.ads[pointer] !== data_idx ) {
      console.log('data_idx', data_idx, heap.ads[pointer])
      console.log('data length', heap.data.length)
      console.log('pointer', pointer)
      throw new Error('overflow')
    }
    return pointer
  }

  function free(pointer){
    if ( pointer === 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    heap.ads[pointer] = 0
  }

  function extend(needed){
    var cl  = heap.data.length
    var nl = max(cl * 2, cl - unallocated + needed)
    if ( nl >= Math.pow(2, heap.ads.BYTES_PER_ELEMENT) ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, nl)
    }
    var update = resize_naive(heap.ads, next, heap.data, nl)
    heap.data = update.data
    heap.ads = update.ads
    brk = update.brk
    unallocated = heap.data.length - brk - 1
  }

  return heap

}

function Constant(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index.
  var next = 1 // this is the next address index.
  var heap = {
    data: new type(size)
  , ads: Address(size, size)
  , alloc: alloc
  }

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
    if ( pointer === heap.ads.length ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    return pointer
  }

  function extend(needed){
    heap.data = resize(heap.data, max(size * 2, size - unallocated + needed), heap.data.length)
  }

  return heap
}

function Stack(type, size, silent){
  silent = silent || true
  if ( size < 1 ) throw new Error('minimum size is 1')

  var unallocated = size - 1
  var brk = 1 // this is the next data index.
  var next = 1 // this is the next address index.
  var heap = {
    data: new type(size)
  , ads: Address(size, size)
  , alloc: alloc
  , free: free
  , brk: function(){return [brk, next]}
  }

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
    if ( pointer === heap.ads.length ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, heap.data.length)
    }
    heap.ads[pointer] = data_idx
    return pointer
  }

  function free(pointer){
    if ( pointer === 0 ) {
      if ( silent ) return
      throw new Error('trying to free pointer: ' + pointer )
    }
    unallocated += brk - heap.ads[pointer]
    brk = heap.ads[pointer]
    next = pointer
  }

  function extend(needed){
    var cl  = heap.data.length
    var nl = max(cl * 2, cl - unallocated + needed)
    if ( nl >= Math.pow(2, heap.ads.BYTES_PER_ELEMENT) ) {
      heap.ads = resize(heap.ads, heap.ads.length * 2, nl)
    }
    var update = resize_naive(heap.ads, next, heap.data, nl)
    heap.data = update.data
    heap.ads = update.ads
    brk = update.brk
    unallocated = heap.data.length - brk - 1
  }

  return heap
}


var naives = Naive(Uint32Array, Math.pow(2,12) , false)
var consts = Constant(Uint32Array, 8, false)
var stacks = Stack(Uint32Array, Math.pow(2,12), false)

var number_uid = 0
var pointers = [] // this can be a typedarray
var values = [] // this no, because has to store the object references

function heap_factory(t){
  return function(size){
    var pointer = t.alloc(size)
    var didx = t.ads[pointer]
    t.data[didx] = size
    number_uid = number_uid + 1
    pointers[number_uid] = pointer
    values[number_uid] = t
    return number_uid
  }
}

var numbers = heap_factory(naives)
var constants = heap_factory(consts)
var temp = heap_factory(stacks)


var zero = constants(2)
var t_zero = values[zero]
t_zero.data[t_zero.ads[pointers[zero]] + 1] = 0 // type integer

var one = constants(3)
var t_one = values[one]
var didx_one = t_one.ads[pointers[one]]
t_one.data[didx_one + 1] = 0 // type integer
t_one.data[didx_one + 2] = 1 // value

var β  = constants(4)
var t_β = values[β]
var didx_β = t_β.ads[pointers[β]]
t_β.data[didx_β + 1] = 0 // type integer
t_β.data[didx_β + 2] = 0 // value
t_β.data[didx_β + 3] = 1 // value

function to_int(num, storage){
  if ( num === 0 ) return zero
  if ( num === 1 ) return one
  storage = storage || numbers

  var size_r = 3 + floor(logn(num) / logn2_26)

  var R_idx = storage(size_r)
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointers[R_idx]]
  data_r[didx_r + 1] = 0 // type integer
  for ( var i = 2; i < size_r; i++ ) {
    data_r[didx_r + i] = num
    num = num >>> 26
  }

  return R_idx
}

function arr_to_int(arr, all){
  all = all || false

  var I_idx = temp( all ? arr[0] : arr.length + 2 )
  var t_i = values[I_idx]
  var data_i = t_i.data
  var didx_i = t_i.ads[pointers[I_idx]]
  data_i[didx_i + 1] = all ? arr[1] : 0
  for( var i = 2, j = all ? 2 : 0; j < arr.length; i++, j++ ) {
    data_i[didx_i + i] = arr[j]
  }
  return I_idx
}

function add(A_idx, B_idx, storage){
  storage = storage || numbers

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]
  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]

  // this has to be repeated because
  // it might change after allocate:
  var size_a = t_a.data[t_a.ads[pointer_a]]
  var size_b = t_b.data[t_b.ads[pointer_b]]

  if ( size_a >= size_b ) {

    var size_r = size_a + 1
    var R_idx = storage(size_r)

    var t_r = values[R_idx]
    var data_r = t_r.data
    var didx_r = t_r.ads[pointers[R_idx]]
    data_r[didx_r + size_r - 1] = 0 // possible garbage cleanup

    var data_a = t_a.data
    var didx_a = t_a.ads[pointer_a]

    var data_b = t_b.data
    var didx_b = t_b.ads[pointer_b]

    data_r[didx_r + 1] = 0 // type integer

    var carry = 0
    var partial = 0

    for ( var i = 2; i < size_b; i ++ ) {
      partial = data_a[didx_a + i] + data_b[didx_b + i] + carry
      data_r[didx_r + i] = partial & 0x3ffffff
      carry = partial >>> 26
    }

    for ( ; i < size_a; i ++ ) {
      partial = data_a[didx_a + i] + carry
      data_r[didx_r + i] = partial & 0x3ffffff
      carry = partial >>> 26
    }

  } else { // B is longer

    var size_r = size_b + 1
    //var predump = 'data2: ' + debug.dump(naives.data)
    //var prel = naives.data.length
    var R_idx = storage(size_r)

    var t_r = values[R_idx]
    var data_r = t_r.data
    var didx_r = t_r.ads[pointers[R_idx]]
    data_r[didx_r + size_r - 1] = 0 // possible garbage cleanup

    var data_a = t_a.data
    var didx_a = t_a.ads[pointer_a]

    var data_b = t_b.data
    var didx_b = t_b.ads[pointer_b]

    data_r[didx_r + 1] = 0 // type integer

    var carry = 0
    var partial = 0

    for ( var i = 2; i < size_a; i ++ ) {
      partial = data_a[didx_a + i] + data_b[didx_b + i] + carry
      data_r[didx_r + i] = partial & 0x3ffffff
      carry = partial >>> 26
    }

    for ( ; i < size_b; i ++ ) {
      partial = data_b[didx_b + i] + carry
      data_r[didx_r + i] = partial & 0x3ffffff
      carry = partial >>> 26
    }
  }

  if ( carry ) {
    data_r[didx_r + i] += carry
  } else {
    data_r[didx_r] = data_r[didx_r] - 1
  }

  return R_idx
}

function subtract(A_idx, B_idx, storage){
  storage = storage || numbers

  var comp = compare_abs(A_idx, B_idx)
  if ( comp === 0 ) {
    return zero
  } else if ( comp < 0 ) {
    // TODO
    // maybe instead of swapping the input order
    // it would be better to have the
    // algorith implemented for both orders
    var temp = A_idx
    A_idx = B_idx
    B_idx = temp
  }

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]

  var size_r = t_a.data[t_a.ads[pointer_a]]

  var R_idx = storage(size_r)

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]
  var size_a = data_a[didx_a]

  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[B_idx]]
  var size_b = data_b[didx_b]

  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointers[R_idx]]

  data_r[didx_r + 1] = 0 // type integer

  var r = 0
  var carry = 0

  for ( var i = 2; i < size_b; i ++ ) {
    r = data_a[didx_a + i] - data_b[didx_b + i] + carry
    if ( r < 0 ) {
      r += 0x4000000
      carry = -1
    } else {
      carry = 0
    }
    data_r[didx_r + i] = r
  }
  for ( ; i < size_a; i ++ ) {
    r = data_a[didx_a + i] + carry
    if ( r < 0 ) {
      data_r[didx_r + i] = r + 0x4000000
      carry = -1
    } else {
      data_r[didx_r + i] = r
      carry = 0
    }
  }
  data_r[didx_r + i] += carry

  var trailing_zeroes = 0
  while ( data_r[didx_r + (--i)] === 0 && i > 1) {
    trailing_zeroes++
  }
  if ( trailing_zeroes ) data_r[didx_r] = size_r - trailing_zeroes

  return R_idx
}

function multiply(A_idx, B_idx, storage) {
  storage = storage || numbers

  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]

  var size_a = t_a.data[t_a.ads[pointer_a]]
  var size_b = t_b.data[t_b.ads[pointer_b]]

  var size_t = size_a + size_b - 2
  var t = temp(size_t) // header(2 blocks) is in both, so has to be removed
  // console_log('----------------------------------', get_max_size())

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]

  var pointer_t = pointers[t]
  var t_t = values[t]

  var data_t = t_t.data
  var didx_t = t_t.ads[pointer_t]

  data_t[didx_t + 1] = 0 // type integer
  for ( var i = 2; i < size_t; i++ ) data_t[didx_t + i] = 0 // get rid of garbage

  var tj = 0
  var c = 0
  var n = 0

  for ( var i = 2; i < size_a; i++ ) {
    var a = data_a[didx_a + i]
    n = 0
    for ( var j = 2; j < size_b; j++ ) {
      c = n
      tj = a * data_b[didx_b + j] + data_t[didx_t + i + j - 2] + c
      data_t[didx_t + i + j - 2] = tj & 0x3ffffff
      n = (tj / 0x4000000) | 0
    }
    data_t[didx_t + i + size_b - 2] = n
  }

  var trailing_zeroes = 0
  var k = size_a + size_b - 3 + didx_t
  while ( k > didx_t + 2 && data_t[k] === 0) {
    k--
    trailing_zeroes++
  }

  var size_r = size_a + size_b  - trailing_zeroes - 2
  if ( trailing_zeroes ) data_t[didx_t] = size_r

  if ( storage == numbers ) {
    var R_idx = storage(size_r)

    var t_r = values[R_idx]
    var data_r = t_r.data
    var didx_r = t_r.ads[pointers[R_idx]]
    for ( var l = 0; l < size_r; l++ ) {
      data_r[didx_r + l] = data_t[didx_t + l]
    }
    stacks.free(pointer_t)
    return R_idx
  }

  return t
}

function left_shift(I_idx, n, storage){
  if ( equal(I_idx, zero) ) return zero
  storage = storage || numbers
  var words = (n / 26) | 0
  var bits = n % 26
  var offset_bits = 26 - bits

  var pointer_i = pointers[I_idx]
  var t_i = values[I_idx]
  var size_i = t_i.data[t_i.ads[pointer_i]]

  // size of the returned bigint will be the size of the input + the number of words it will be
  // extended with
  // and depending on the most significant bigit's size 1 or 0 more
  var msdi = t_i.data[t_i.ads[pointer_i] + size_i - 1]
  var bits_word = ((msdi * Math.pow(2,bits)) > 0x3ffffff ? 1 : 0)
  var R_idx = storage(size_i + words + bits_word)
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointers[R_idx]]
  data_r[didx_r + 1] = 0 // type integer

  // data index has to be cached AFTER the allocation because 
  // the allocation might change the indeces received
  var data_i = t_i.data
  var didx_i = t_i.ads[pointer_i]

  // clean possible garbage
  for ( var i = 2; i < words + 2; i++ ) {
    data_r[didx_r + i] = 0
  }

  if ( bits > 0 ) {
    var carry = 0
    for ( var j = 2; j < size_i; j++ ) {
      data_r[didx_r + words + j] = (carry + (data_i[didx_i + j] << bits)) & 0x3ffffff
      carry = data_i[didx_i + j] >>> offset_bits
    }
    data_r[didx_r + words + j] = carry

  } else {
    for ( var i = 2; i < size_i; i++ ) {
      data_r[didx_r + words + i] = data_i[didx_i + i]
    }
  }
  return R_idx
}

function right_shift(I_idx, n, storage){
  if ( equal(I_idx, zero) ) return zero
  if ( n === 0 ) return I_idx
  storage = storage || numbers
  var words = (n / 26) | 0 
  var bits = n % 26
  var offset_bits = 26 - bits

  var pointer_i = pointers[I_idx]
  var t_i = values[I_idx]
  var size_i = t_i.data[t_i.ads[pointer_i]]
  var most_significant_bigit_i = t_i.data[t_i.ads[pointer_i] + size_i - 1]
  var bit_offset = ( most_significant_bigit_i >>> bits ? 0 : 1)
  var size_r = size_i - words - bit_offset 
  if ( size_r < 2 ) throw new Error('you shifted so much to the right, you came back on the left side!')

  var R_idx = storage(size_r)
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointers[R_idx]]
  data_r[didx_r + 1] = 0 // type integer

  var data_i = t_i.data
  var didx_i = t_i.ads[pointer_i]

  for ( var j = 2 + words, i = 2; j < size_i ; j++, i++ ) {
    data_r[didx_r + i] = ((data_i[didx_i + j] >>> bits) + ( j + 1 < size_i ? data_i[didx_i + j + 1] << offset_bits : 0)) & 0x3ffffff
  }

  var trailing_zeroes = 0
  var k = didx_r + size_r - 1
  while ( k > didx_r + 2 && data_r[k] === 0) {
    k--
    trailing_zeroes++
  }

  if ( trailing_zeroes ) data_r[didx_r] = size_r - trailing_zeroes
  return R_idx
}

function sub(A_idx, B_idx){
  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]
  var BR_idx = temp(size_b + 1)

  var pointer_br = pointers[BR_idx]
  var t_br = values[BR_idx]
  var data_br = t_br.data
  var didx_br = t_br.ads[pointer_br]

  data_br[didx_br + 1] = 0 // type integer
  data_br[didx_br + 2] = 0 // some garbage might be there

  // left shifting: multiply B with β
  for ( var i = 2; i < size_b; i++ ) {
    data_br[didx_br + i + 1] = data_b[didx_b + i]
  }

  if ( compare_abs(A_idx, BR_idx) >= 0  ) {
   var C = subtract(A_idx, BR_idx, temp)
   var t = slowdiv(C, B_idx)
    return [add(t[0], β, temp), t[1]]
  }
  var pointer_a = pointers[A_idx]
  var t_a = values[A_idx]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]

  var size_a = data_a[didx_a]

  //TODO: this to be removed
  if ( size_a < 4 ) throw new Error('size too small')
  var q = floor((base * data_a[didx_a + size_a - 1] + data_a[didx_a + size_a - 2]) / data_b[didx_b + size_b - 1])

  if ( q > base - 1 ) q = base - 1
  var Q = temp(3)
  var pointer_q = pointers[Q]
  var t_q = values[Q]
  var data_q = t_q.data
  var didx_q = t_q.ads[pointer_q]
  data_q[didx_q + 1] = 0 // type integer
  data_q[didx_q + 2] = q // value

  var T = multiply(Q, B_idx, temp)
  var corrected = false
  if ( compare_abs(T, A_idx) > 0 ) {
    q = q - 1
    var T = subtract(T, B_idx, temp)
    corrected = true
  }
  if ( compare_abs(T, A_idx) > 0 ) {
    q = q - 1
    var T = subtract(T, B_idx, temp)
  }
  if ( corrected ) {
    var Q = temp(3)
    var pointer_q = pointers[Q]
    var t_q = values[Q]
    var data_q = t_q.data
    var didx_q = t_q.ads[pointer_q]
    data_q[didx_q + 1] = 0 // type integer
    data_q[didx_q + 2] = q // value
  }
  return [Q, subtract(A_idx, T, temp)] 
}

function slowdiv(A_idx, B_idx){
  //console_log('MAXSIZE', get_max_size())

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]
  var most_significant_digit_b = data_b[didx_b + size_b - 1]
  if ( most_significant_digit_b < half_base ) {

    var shifted = ceil(logn(half_base / most_significant_digit_b) / LN2) 
    var As_idx = left_shift(A_idx, shifted, temp)
    var Bs_idx = left_shift(B_idx, shifted, temp)

    var pointer_a = pointers[As_idx]
    var t_a = values[As_idx]
    var m = t_a.data[t_a.ads[pointer_a]]

    var pointer_b = pointers[Bs_idx]
    var t_b = values[Bs_idx]
    var n = t_b.data[t_b.ads[pointer_b]]

    if ( m < n ) {
      return [zero, A_idx]
    }

    if ( m == n ) {
      var c = compare_abs(As_idx, Bs_idx)
      if ( c < 0 ) return [zero, A_idx]
      if ( c === 0 ) return [one, zero]
      return [one, subtract(A_idx, B_idx, temp)]
    }

    if ( m == n + 1 ) {
      var qr = sub(As_idx, Bs_idx)
      return [qr[0], right_shift(qr[1], shifted, temp)]
    }

    var powerdiff = (m - n - 1) * 26
    var A_p = right_shift(As_idx, powerdiff, temp)
    var t3 = sub(A_p, Bs_idx, temp)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff, temp), subtract(As_idx, left_shift(A_p, powerdiff, temp), temp), temp), Bs_idx)

    return [add(left_shift(t3[0], powerdiff, temp), t4[0], temp), right_shift(t4[1], shifted, temp)]

  } else {

    var pointer_a = pointers[A_idx]
    var t_a = values[A_idx]
    var m = t_a.data[t_a.ads[pointer_a]]

    var pointer_b = pointers[B_idx]
    var t_b = values[B_idx]
    var n = t_b.data[t_b.ads[pointer_b]]

    if ( m < n ) {
      return [zero, A_idx]
    }

    if ( m == n ) {
      var c = compare_abs(A_idx, B_idx)
      if ( c < 0 ) return [zero, A_idx]
      if ( c === 0 ) return [one, zero]
      return [one, subtract(A_idx, B_idx, temp)]
    }

    if ( m == n + 1 ) {
      return sub(A_idx, B_idx)
    }

    var powerdiff = (m - n - 1) * 26
    var A_p = right_shift(A_idx, powerdiff, temp)

    var t3 = sub(A_p, B_idx, temp)
    var t4 = slowdiv(add(left_shift(t3[1], powerdiff, temp), subtract(A_idx, left_shift(A_p, powerdiff, temp), temp), temp), B_idx)

    return [add(left_shift(t3[0], powerdiff, temp), t4[0], temp), t4[1]]
  }
}

function divide(dividend, divisor, storage){
  storage = storage || numbers
  var mark = temp(2) //get a handle to temp where I can reset the breaking point back to with free()
  var T = slowdiv(dividend, divisor)
  var q = T[0], r = T[1]

  var pointer_q = pointers[q]
  var t_q = values[q]
  var size_q = t_q.data[t_q.ads[pointer_q]]

  var pointer_r = pointers[r]
  var t_r = values[r]
  var size_r = t_r.data[t_r.ads[pointer_r]]

  var Q_idx = storage(size_q)
  var pointer_Q = pointers[Q_idx]
  var t_Q = values[Q_idx]
  var data_q = t_q.data
  var didx_q = t_q.ads[pointer_q]
  var data_Q = t_Q.data
  var didx_Q = t_Q.ads[pointer_Q]
  for ( var l = 0; l < size_q; l++ ) {
    data_Q[didx_Q + l] = data_q[didx_q + l]
  }

  var R_idx = storage(size_r)
  var pointer_R = pointers[R_idx]
  var t_R = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]
  var data_R = t_R.data
  var didx_R = t_R.ads[pointer_R]
  for ( var l = 0; l < size_r; l++ ) {
    data_R[didx_R + l] = data_r[didx_r + l]
  }
  stacks.free(pointers[mark])
  return [Q_idx, R_idx]
}

function compare_abs(aidx, bidx){
  if ( aidx == bidx ) return 0
  var t_a = values[aidx]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointers[aidx]]

  var t_b = values[bidx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[bidx]]

  var a_size = data_a[didx_a]
  var b_size = data_b[didx_b]
  if ( a_size < b_size ) {
    return -1
  } else if ( b_size < a_size ) {
    return 1
  } else {
    for ( var i = a_size - 1; i > 0; i-- ) {
      if ( data_a[didx_a + i] < data_b[didx_b + i] ) {
        return -1
      } else if ( data_a[didx_a + i] > data_b[didx_b + i] ) {
        return 1
      }
    }
    return 0
  }
}

function equal(a, b){
  if ( a === b ) return true
  var t_a = values[a]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointers[a]]
  var size_a = t_a.data[didx_a]

  var t_b = values[b]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[b]]
  var size_b = t_b.data[didx_b]

  if ( size_a !== size_b ) return false
  for ( var i = 1; i < size_a; i++ ) {
    if ( data_a[didx_a + i] != data_b[didx_b + i] ) return false
  }
  return true
}

var ten = to_int(10000)
var pot = [one, ten]

function power_of_ten(i){
  if ( pot[i] !== null ) return pot[i]
  for ( var k = pot.length; k <= i; k++ ) {
    // there is not much sense in caching if it will be cleared
    pot[k] = multiply(pot[k - 1], ten, numbers) 
  }
  return pot[i]
}

function parse_base10(str, storage){
  var r = zero
  var i = 0
  while ( str.length ) {
    r = i === 0 ? to_int(Number(str.slice(-4)), temp)
      :           add(r, multiply(to_int(Number(str.slice(-4)), temp), power_of_ten(i), temp), temp)
    str = str.slice(0, -4)
    i++
  }
  if ( storage == numbers ) {
    var pointer_r = pointers[r]
    var t_r = values[r]

    var size_r = t_r.data[t_r.ads[pointer_r]]

    var R_idx = storage(size_r)

    var pointer_R = pointers[R_idx]
    var t_R = values[R_idx]
    var data_R = t_R.data
    var didx_R = t_R.ads[pointer_R]

    var data_r = t_r.data
    var didx_r = t_r.ads[pointer_r]

    for ( var l = 0; l < size_r; l++ ) {
      data_R[didx_R + l] = data_r[didx_r + l]
    }

    stacks.free(pointer_r)
    return R_idx
  }
  return r
}

function to_base10(bigint){
  var dec = []
  while( compare(bigint, ten) >= 0 ) {
    var r = divide(bigint, ten, temp)
    var rem_idx = r[1]

    var t_r = values[rem_idx]
    var data_r = t_r.data
    var didx_r = t_r.ads[pointers[rem_idx]]

    var digit = data_r[didx_r] > 2 ? data_r[didx_r + 2] + '' : ''

    dec.push(Array(5 - digit.length).join('0') + digit)
    bigint = r[0]
  }
  var t_b = values[bigint]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[bigint]]

  digit = data_b[didx_b] > 2 ? data_b[didx_b + 2] + '' : ''
  dec.push(digit)
  return dec.reverse().join('')
}

function clone(idx, storage){
  storage = storage || numbers

  var t = values[idx]
  var data = t.data
  var didx = t.ads[pointers[idx]]
  var size = data[didx]

  var cidx = storage(size)
  var ct = values[cidx]
  var cdata = ct.data
  var cdidx = ct.ads[pointers[cidx]]

  for ( var i = 1; i < size; i++ ) {
    cdata[cdidx + i] = data[didx + i]
  }

  return cidx
}

function print(n, idx){
  var pointer = pointers[idx]
  var t = values[idx]
  var data = t.data
  var didx = t.ads[pointer]
  var v = []
  var guard = 1000
  var size = data[didx]
  if ( size < 2 ) {
    console_log( n, pointer, didx, data[didx])
    throw new Error('size should never be less than 2')
  }
  for ( var j = 0; j < size; j++ ) {
    v.push(data[didx + j])
    if ( ! (--guard) ) throw new Error('safeguard. number is larger than 1000 digits OR corrupted memory')
  }

  return console_log(n, v.join(', '))
  //return console_log('[', v.join(' , '), ']')
}

global.print = print


function compare(a, b){


  var t_a = values[a]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointers[a]]
  if ( data_a[didx_a] == 2 ) return 0
  var na = ( data_a[didx_a + 1] & 1 ) 

  var t_b = values[b]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[b]]
  if ( data_b[didx_b] == 2 ) return 0
  var nb = ( data_b[didx_b + 1] & 1 ) 

  return na + nb === 0   ? na < nb 
       : /* same sign */   compare_abs(a, b) * (na || 1)

}

function addition(a, b, storage){
  storage = storage || numbers

  var t_a = values[a]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointers[a]]
  var na = ( data_a[didx_a + 1] & 1 ) 
  if ( data_a[didx_a] == 2 ) return b 

  var t_b = values[b]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[b]]
  var nb = ( data_b[didx_b + 1] & 1 ) 
  if ( data_b[didx_b] == 2 ) return a 

  if ( na == nb ) {
    var r = add(a, b, storage)
  } else {
    if ( compare_abs(a, b) == -1 ) {
      var t = a
      a = b
      b = t
      t = na
      na = nb
      nb = t
    }
    var r = subtract(a, b, storage)
  }

  var t_r = values[r]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointers[r]]
  if ( data_r[didx_r] > 2 ) {
    data_r[didx_r + 1] = na
  }

  return r
}

function subtraction(a, b, storage){
  storage = storage || temp
  var t_b = values[b]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointers[b]]
  if ( data_b[didx_b] == 2 ) return a
  var t_a = values[a]
  var data_a = t_a.data
  var didx_a = t_a.ads[pointers[a]]
  var a_is_zero = data_a[didx_a] == 2 ? true : false
  var subtrahend = clone(b, a_is_zero ? storage : temp)

  var nb = ( data_b[didx_b + 1] & 1 ) 

  var t_s = values[subtrahend]
  var data_s = t_s.data
  var didx_s = t_s.ads[pointers[subtrahend]]
  data_s[didx_s + 1] = nb ? 0 : 1
  
  return a_is_zero ? subtrahend : addition(a, subtrahend, storage)
}

function multiplication(a, b){
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
  if ( equal(b, zero) ) throw new Error('can\'t divide with zero')
  if ( equal(a, zero) ) return [zero, zero]
  var z = compare_abs(a, b) == -1
  if ( z ) return [zero, a]
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

function parse(str, storage){
  storage = storage || numbers
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
arb.to_int = to_int
arb.arr_to_int = arr_to_int

arb.gcd = gcd
arb.lcm = lcm

arb.negate = negate
arb.abs = abs

arb.one = one
arb.zero = zero

arb.compare_abs = compare_abs
arb.compare = compare

arb.equal = equal

arb.memory = { naives: naives
             , consts: consts
             , stacks: stacks

             , numbers: numbers
             , constants: constants
             , temp: temp

             , values: values
             , pointers: pointers
             }

arb.print = print


module.exports = arb

