void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')
  var one = pool(type('integer'), 1)
  one[2] = 1
  module.exports = one
}()
