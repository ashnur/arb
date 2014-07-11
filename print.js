module.exports = print
var memory = require('./memory.js')
var heap = memory.data
var ads = memory.ads

function to_poly(name, arr){
  var r = []
  for ( var i = 2; i < heap[arr + 1]; i++ ) {
    r.push(heap[arr + i]  + ' * 65536^' +(i-2))
  }
  if ( ! r.length) r.push(0)
  log(name, r.join(' + '))
}

function print(n, pointer){
  console.log('print', pointer)
  var v = []
  var i = []
  var a = 0
  var guard = 100
  while (  pointer != 0  ) {
    // console.log(pointer)
    //if ( a > 1 ) v.push(heap[pointer]  + ' * 65536^' + ( a - 2 ) )
    v.push(heap[pointer])
    i.push(pointer + ':' + ads[pointer])
    pointer = ads[pointer]
    a++
    if ( ! (--guard) ) {
      break
    } 
  }
  if ( ! v.length ) v.push(0)
  if ( guard == 0 ) console.error('y u do dis') 
  return console.log('print: ' + n,v.join(' , '), i)
}

