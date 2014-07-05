var sign = require('../../sign.js')
var memory = require('../../memory.js')
var heap = memory.data

var size = {
  name: 'size'
, describe: function(pointer){
    var size = heap[pointer + 1]
    return size < 2              ? [0 , 'tiny']
         : size >= 2 && size < 6 ? [1 , 'small']
         :                         [2 , 'large']
  }
}

var complexity = {
  name: 'complexity'
, describe: function(pointer){
    for ( var i = pointer + 2; i < pointer + heap[pointer + 1] ; i++ ) {
      if ( heap[i] > 9  ) return [1, 'complex']
    }
    return [0, 'simple']
  }
}

var s = {
  name: 'sign'
, describe: function(v){
    var s = sign.read(v)
    return [Number(s), s ? 'integer' : 'positive']
  }
}

module.exports = ['bigint', [size, complexity, s]]

