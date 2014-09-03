var liberate = require('liberate')
var test = require('tape')
var map = liberate(Array.prototype.map)
var reduce = liberate(Array.prototype.reduce)
var every = liberate(Array.prototype.every)
var slice = liberate(Array.prototype.slice)
var join = liberate(Array.prototype.join)
var filter = liberate(Array.prototype.filter)

var fromCharCode = function(num){ return String.fromCharCode(num) }

var memsize = 32
var cnstsize = 16
var memory = require('../index.js')

var numbers = memory.numbers(Uint8Array, memsize, false)
var constants = memory.constants(Uint8Array, cnstsize, false)
var temp = memory.temp(Uint8Array, Math.pow(2, 10), false)



test('init', function(t){
  t.ok(numbers.data  instanceof Uint8Array, 'type is Uint8Array')
  t.ok(numbers.data.length == memsize, 'data length is ' + memsize)
  t.ok(numbers.ads  instanceof Uint8Array, 'index type is Uint8Array')
  t.ok(numbers.ads.length == memsize, 'index data length is ' + memsize)
  t.ok(constants.data  instanceof Uint8Array, 'type is Uint8Array')
  t.ok(constants.data.length == cnstsize, 'data length is ' + cnstsize)
  t.ok(constants.ads  instanceof Uint8Array, 'index type is Uint8Array')
  t.ok(constants.ads.length == cnstsize, 'index data length is ' + cnstsize)
  t.end()
})

test('alloc', function(t){
  var str = 'Hello World!'
  var p = saveString(str)
  var r = readString(p)
  t.ok(str == r, 'storing and restoring')
  t.end()
})

var constant_str_input = 'i, robot'
var constant_str_stored

test('const', function(t){
  constant_str_stored = saveString(constant_str_input, true)
  var r = readString(constant_str_stored, true)
//console.log('r', r)
  t.ok(constant_str_input == r, 'storing and restoring')
  t.end()
})


test('free', function(t){
  var brave = saveString('brave')
  var rbrave = readString(brave)
  var newish = saveString('new')
  var world = saveString('world')
  var rnewish = readString(newish)
  t.ok('new' == rnewish, 'storing and restoring')
  numbers.free(newish)
  t.ok('brave' == rbrave, 'storing and restoring')
  t.ok('world' == readString(world), 'storing and restoring')
  var antic_hay = saveString('antic hays')
//dump()
  var rah = readString(antic_hay)
//  console.log('rah', rah)
  t.ok('antic hays' == rah, 'storing and restoring')
  numbers.free(world)
  numbers.free(antic_hay)
  numbers.free(brave)

  var st = saveString('starship trooperssss')
  t.ok('starship trooperssss' == readString(st), 'storing and restoring')

  t.end()
})

function saveString(str, cnst){
  var alloc = cnst ? constants.alloc : numbers.alloc
  var ads = cnst ? constants.ads : numbers.ads
  var size = str.length + 1
  var pointer = alloc(size)
  var data = cnst ? constants.data : numbers.data
  var start = ads[pointer]
  var idx = start
  var i = 0
  data[idx++] = str.length
  //console.log('trying to save', str, str[i])
  //console.log(idx, start, size)
  while ( idx < start + size ) {
    // console.log('s', idx, str.charCodeAt(i), str[i])
    data[idx++] = str.charCodeAt(i++)
  }
  return pointer
}

function readString(pointer, cnst){
  var data = cnst ? constants.data : numbers.data
  var ads = cnst ? constants.ads : numbers.ads
  var values = []
  var start = ads[pointer]
  var idx = start
  var size = data[idx++]
  //console.log('trying to read', pointer, size, data.length)
  while ( idx <= start + size ) {
    //console.log('g', idx, fromCharCode(data[idx]))
    values.push(data[idx++])
  }
  return join(map(values, fromCharCode), '')
}

function dump(){
  var indeces = slice(numbers.ads,0)
  var ind_out = []
  indeces.forEach(function(v, i){
    ind_out.push(i+ ',' + v )
  })
  console.log('indeces')
  console.log(ind_out.join('|'))
  var values = slice(numbers.data,0)
  var val_out = []
  values.forEach(function(v, i){
    var V = v > 65 ? ',' + fromCharCode(v)  : ''
    val_out.push([i+ ', '+ v +V ])
  })
  console.log('values')
  console.log(val_out.join('|'))
}
function add(x, y){ return x + y }
function sum(xs){ return reduce(xs, add) }
function isZero(x){ return x === 0 }
function index_over(min){
  return function(_, i){
    return i > min
  }
}

function index_under(max){
  return function(_, i){
    return i <= max
  }
}
