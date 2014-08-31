module.exports = Memory
var rand = Math.random
var Address = require('./address.js')
var Naive = require('./naive.js')
var Constant = require('./constant.js')
var Stack = require('./stack.js')

// for making my work a bit easier
// i consider length of largers bigint
// to be 1900 bigits. that's over 9000 digits
// in base10
// and if i will get to base 26, that will be
// at most 350 bigits.


function Memory(type, size, cnstsize, silent){

  cnstsize = cnstsize || 0

  return {
    numbers: Naive(type, size, silent)
  , consts: Constant(type, cnstsize, silent)
  , stacks: Stack(silent)
  }

}

