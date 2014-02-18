void function(){
  module.exports = ['int', [{
    name: 'integer'
  , describe: function stat_int(v){
      return v < 10               ? [0, 'small']
           : v >= 10 && v < 65536 ? [1, 'normal']
           :                        [2, 'big']
    }
  }]]
}()
