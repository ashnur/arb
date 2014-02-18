void function(){
  var sign = require('../../sign.js')

  var size = {
    name: 'size'
  , describe: function(v){
      return v.length < 3                  ? [0 , 'tiny']
           : v.length >= 3 && v.length < 6 ? [1 , 'small']
           :                                 [2 , 'large']
    }
  }

  var complexity = {
    name: 'complexity'
  , describe: function(v){
      for ( var i = 2; i < v.length ; i++ ) {
        if ( v[i] > 9  ) return [1, 'complex']
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

}()
