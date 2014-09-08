module.exports = subtract

var liberate = require('liberate')
var map = liberate(Array.prototype.map)

var ZERO = require('./zero.js')
var print = require('./print.js')
var compare = require('./integer_compare_abs.js')
var memory = require('./memory.js')
var numbers = memory.numbers
var pointers = memory.pointers
var values = memory.values

function subtract(A_idx, B_idx){
  //var pcdidx_a = values[A_idx].ads[pointers[A_idx]]
  //var pcdidx_b = values[B_idx].ads[pointers[B_idx]]

  //console.log('precheck', pcdidx_a , pcdidx_b)

  var comp = compare(A_idx, B_idx)
  if ( comp == 0 ) {
    return ZERO
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

  var R_idx = memory.numbers(size_r)

  var data_a = t_a.data
  var didx_a = t_a.ads[pointer_a]
  var size_a = data_a[didx_a]

  var pointer_b = pointers[B_idx]
  var t_b = values[B_idx]
  var data_b = t_b.data
  var didx_b = t_b.ads[pointer_b]
  var size_b = data_b[didx_b]

  var pointer_r = pointers[R_idx]
  var t_r = values[R_idx]
  var data_r = t_r.data
  var didx_r = t_r.ads[pointer_r]

  data_r[didx_r + 1] = 0 // type integer

  var r = 0
  var carry = 0

  for ( var i = 2; i < size_b; i ++ ) {
    r = data_a[didx_a + i] - data_b[didx_b + i] + carry
    if ( r < 0 ) {
      var x1 = Math.max.apply(null, map(Object.keys(memory.pointers).filter(function(v){ return v != 0 }), getsize))
      data_r[didx_r + i] = r + 65536
      carry = -1
      var x2 = Math.max.apply(null, map(Object.keys(memory.pointers).filter(function(v){ return v != 0 }), getsize))
      //if ( x2 > x1 ) {
      //  console.log('A data idx ->', didx_a)
      //  print('A', A_idx)
      //  console.log('B data idx ->', didx_b)
      //  print('B', B_idx)
      //  console.log('R data idx ->', didx_r)
      //  console.log('R i', i)
      //  print('R', R_idx)
      //  console.log(dumpta(data_r))
      //}
    } else {
      data_r[didx_r + i] = r
      carry = 0
    }
  }
  for ( ; i < size_a; i ++ ) {
    r = data_a[didx_a + i] + carry
    if ( r < 0 ) {
      data_r[didx_r + i] = r + 65536
      carry = -1
    } else {
      data_r[didx_r + i] = r
      carry = 0
    }
  }
  data_r[didx_r + i] += carry



  //var zs = 0
  //while ( data_r[didx_r + i] == 0 && i > 1) {
  //  zs++
  //  i--
  //}
  //if ( zs ) data_r[didx_r] = size_r - zs

  return R_idx
}

function getsize(idx){
  return memory.values[idx].data[memory.values[idx].ads[memory.pointers[idx]]]
}

function id(x, i){ return i+':'+x }

function dumpta(ta){
  return map(ta, id).join(', ')
  //.replace(/(?:,0)*$/,'').split(',')
}
