var console_log = console.log.bind(console)
var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var filter = liberate(Array.prototype.filter)
var max = Math.max

var start = μ()


module.exports = {
  dump: dumpta
, dump_nice: dumpv
, prems: prems
, ms: MS
, get_max: get_max_size
, log: console_log
, endsize: console_log.bind(null, 'end size')
, save: save
, diff: diff
}

var saves = {}

function save(name, ta){
  saves[name] = new ta.constructor(ta.length)
  saves[name].set(ta)
}

function compare(ta){
  return function(a, i){ return a === ta[i] }
}

function diff(w, ta){
  return filter(ta, compare(saves[w]))
}

var stash = []

function prems(ads, data){
  var pre =  get_max_size(ads, data) + '\n' + dumpta(ads)+ '\n' +dumpv(data, ads) + '\n' + dumpta(data)
  stash.push(pre)
  return stash.length - 1
}

function id(x){ return x }
function pair(data, x){ return [x, data[x]] }

function size(data, data_index){ return data[data_index] }

function get_max_size(ads,data){ 
  return max.apply(map(ads, size.bind(null, data))) 
}

function MS(ads, data, pre, name){
  var ms = get_max_size(ads, data)
  if ( ms > 30  ) {
    console_log(name)
    console_log(pre)
    console_log(ms)
    console_log(dumpta(ads))
    console_log(dumpta(data))
    throw new Error('FINISH It!!!!')
  }
}

function dumpta(ta){ 
  //.filter(below(200))
  return map(ta, id).join(',') + ' :: ' + (μ() - start)
}
function dumpv(data, ta){ 
  return map(ta, pair.bind(null, data)).join(' | ')
}
function findlast(ta){
  var last = 0
  for ( var i = 0; i < ta.length; i++ ) {
    if ( ta[i] > 0 ) last = i
  }
  return last
}

//function id(x){ return x }

function below(limit){ return function(_,i){ return i < limit } }
function between(from, to){ return function(_,i){ return i >= from && i <= to } }

function μ(){
  return 0
  //return microtime.now()
}







