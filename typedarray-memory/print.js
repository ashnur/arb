
function print(n, pointer){
  var v = []
  var i = []
  var guard = 1000
  while (  pointer != 0  ) {
    if ( ! (guard --) ) throw new Error('print in free')
    v.push(data[pointer])
    pointer = address[pointer]
    i.push(pointer)
  }
  if ( ! v.length ) v.push(0)
  return console.log('mprint:' + n, v.join(', '), i)
}
