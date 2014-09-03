var Naive = require('./naive.js')
var Constant = require('./constant.js')
var Stack = require('./stacks.js')

var exports = { numbers: Naive
              , constants: Constant
              , temp: Stack }

module.exports = exports
