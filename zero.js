void function(){
  var pool = require('./pool.js')
  var zero = pool('integer', 0)
  module.exports = zero
}()
