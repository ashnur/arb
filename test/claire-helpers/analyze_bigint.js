var sign = require('../../sign.js')
var memory = require('../../memory.js')
var pointers = memory.pointers
var values = memory.values

function describeSize(idx){
  var pointer = pointers[idx]
  var t = values[idx]
  var idx = t.data[pointer]
  return size < 4              ? [0 , 'tiny']
       : size >= 4 && size < 8 ? [1 , 'small']
       :                         [2 , 'large']
}

var size = { name: 'size' , describe: describeSize }

function describeComplexity(idx){
  var pointer = pointers[idx]
  var t = values[idx]
  var data = t.data
  var didx = t.ads[pointer]
  var size = t.data[didx]
  for ( var i = didx + 2; i < didx + size ; i++ ) {
    if ( data[i] > 9  ) return [1, 'complex']
  }
  return [0, 'simple']
}

var complexity = { name: 'complexity' , describe: describeComplexity }

function describeSign(v){
  var s = sign.read(v)
  return [Number(s), s ? 'integer' : 'positive']
}

var s = { name: 'sign' , describe: describeSign}

module.exports = ['bigint', [size, complexity, s]]

