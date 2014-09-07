module.exports = print
var memory = require('./memory.js')

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
//console.log('p', pointer, didx, Math.max.apply(0, memory.values.map(function(t){ return t.ads.length})))
// console.log('p', pointer)
// console.log('adz', t.ads)
// console.log('didx', didx)
//console.log('print', idx, pointer)
  var v = []
  var a = 0
  var guard = 1000
  var size = data[didx]
//console.log('size', size)
  for ( var j = 0; j < size; j++ ) {
    //if ( a > 1 ) v.push(heap[pointer]  + ' * 65536^' + ( a - 2 ) )
    v.push(data[didx + j])
    if ( ! (--guard) ) throw new Error('STOP')
  }
  return console.log('' + n,v.join(' , '))
}

