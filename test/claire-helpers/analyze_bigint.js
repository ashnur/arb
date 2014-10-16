var arb = require('../../integer.js')

function describeSize(I){
  var size = arb.int_size(I)
  return size < 4              ? [0 , 'tiny']
       : size >= 4 && size < 8 ? [1 , 'small']
       :                         [2 , 'large']
}

var size = { name: 'size' , describe: describeSize }

function describeComplexity(I){
  var arr = arb.int_to_arr(I)
  for ( var i = 2; i < arr[0] ; i++ ) {
    if ( arr[i] > 9  ) return [1, 'complex']
  }
  return [0, 'simple']
}

var complexity = { name: 'complexity' , describe: describeComplexity }

function describeSign(I){
  var arr = arb.int_to_arr(I)
  var sign = arr[1] & 1
  return [sign, sign ? 'integer' : 'positive']
}

var s = { name: 'sign' , describe: describeSign}

module.exports = ['bigint', [size, complexity, s]]

