var Naive = require('./naive.js')
var Constant = require('./constant.js')
var Stack = require('./stacks.js')

module.exports = { numbers: Naive
                 , constants: Constant
                 , temp: Stack }
