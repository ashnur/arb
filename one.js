void function(){
  var pool = require('./pool.js')
  var one = pool('integer', 1)
  one[2] = 1
  module.exports = one
}()
