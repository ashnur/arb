var test = require('tape')
var rand_int = require('./helpers/rand_int.js')()
var clone = require('../integer_clone.js')
var equal = require('../integer_equality.js')

test('cloning', function(t){
  var a = rand_int()
  var b = clone(a)
  t.ok(equal(a, b))
  t.end()
})
