module.exports = resize

var noop = function(){}
var console_log = console.log.bind(console)

var log = Math.log
var pow = Math.pow
var ceil = Math.ceil
var log2 = log(2)

var max = Math.max

var liberate = require('liberate')
var map = liberate(Array.prototype.map)

function resize(ads, next, data, l, brk){
  var new_ads = new ads.constructor(ads.length)
  // find next power of 2 larger or equal to length
  var length = pow(2, ceil(log(l) / log2))
  var r = new data.constructor(length)
  var ri = 1
  for ( var i = 1; i < next; i++ ) {
    var pre = get_max_size() + '\n' + dumpta(ads)+ '\n' +dumpv(ads) + '\n' + dumpta(data)
    var data_idx = ads[i]
    //console_log('didx', data_idx)
    if ( data_idx != 0 ) {
      var size = data[data_idx]
      //console.log('size', size)
      new_ads[i] = ri
      for ( var j = 0; j < size; j++ ) {
        //console.log('index to write', ri)
        //console.log('value to write', data[data_idx + j])
        r[ri] = data[data_idx + j]
        ri++
      }
    }
    MS(pre, '------------------')
  }
  //for ( var i = next; i < ads.length; i++ ) { ads[i] = 0 }
  return { data: r, brk: ri, ads: new_ads }

  function s(pointer){
    return data[pointer]
  }

  function get_max_size(){
    var ms = max.apply(null, map(ads, s))
    return ms
  }

  function MS(pre, name){

      var ms = get_max_size()
      if ( ms > 30  ) {
        console_log(name)
        console_log(pre)
        console_log(ms)
        console_log(dumpta(ads))
        console_log(dumpv(ads))
        console_log(dumpta(data))
        throw new Error('FINISH It!!!!')
      }
  }

function id(x){ return [x, data[x]] }
function dumpta(ta){
  return map(ta, id).join(',')
}
function dumpv(ta){
  return map(ta, id).join(' | ')
}

}


