// TODO: shouldn't probably use idx here, or at least
// should have the option to just send/receive the type
var memory = require('./memory.js')
var numbers = memory.numbers
var values = memory.values
var pointers = memory.pointers

function bit_test(num, bit){
  return ((num>>bit) % 2 != 0)
}

function bit_set(num, bit){
  return num | 1 << bit
}

function bit_clear(num, bit){
  return num & ~(1<<bit)
}

function bit_toggle(num, bit){
  return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num,bit)
}

module.exports = {
  read: function(idx){
    return bit_test(values[idx][pointers[idx] + 1], 0)
  }
, change: function(idx, value){
    var t = values[idx]
    var pointer = pointers[idx]
    var didx = t.ads[pointer] + 1 // +1 for type, as the first segment is the size
    var data = t.data

    data[didx] = value ? bit_set(data[didx], 0) : bit_clear(data[didx], 0)
  }
}
