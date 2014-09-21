module.exports = print
var memory = require('./memory.js')

var noop = function(){}
var console_log = console.log.bind(console)

function to_poly(name, arr){
  var r = []
  for ( var i = 2; i < heap[arr + 1]; i++ ) {
    r.push(heap[arr + i]  + ' * 65536^' +(i-2))
  }
  if ( ! r.length) r.push(0)
  log(name, r.join(' + '))
}

function print(n, idx){
  var pointer = memory.pointers[idx]
  var t = memory.values[idx]
  var data = t.data
  var didx = t.ads[pointer]
//console_log('p', pointer, didx, Math.max.apply(0, memory.values.map(function(t){ return t.ads.length})))
//console_log('p', pointer)
//console_log('adz', t.ads)
//console_log('didx', didx)
//console_log('print', idx, pointer)
  var v = []
  var a = 0
  var guard = 1000
  var size = data[didx]
  if ( size < 2 ) {
    console_log( n, pointer, didx, data[didx])
    throw new Error('size should never be less than 2')
  }
  if ( size == 2 ) return console_log(''+n, [])
  for ( var j = 0; j < size; j++ ) {
    //if ( a > 1 ) v.push(heap[pointer]  + ' * 65536^' + ( a - 2 ) )
    v.push(data[didx + j])
    if ( ! (--guard) ) throw new Error('STOP')
  }
  return console_log(n, v.join(', '))
  //return console_log('[', v.join(' , '), ']')
}

