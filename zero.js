void function(){
  var pool = require('./pool.js')
  var type = require('./type.js')
  var zero = pool(type('integer'), 0)
  module.exports = zero
}()
