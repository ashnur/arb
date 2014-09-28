var noop = function(){}
var console_log = console.log.bind(console)
var max = Math.max
var liberate = require('liberate')
var map = liberate(Array.prototype.map)
var filter = liberate(Array.prototype.filter)
var max = Math.max
var microtime = require('microtime')

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
  return map(ta, id).filter(below(200)).join(',') + ' :: ' + (μ() - start)
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
  return microtime.now()
}






/*
function topoly(c, p){ return c + '*' + '(2^16)^' + (Number(p) + 2) }
function toarr(id){
  var t = memory.values[id]
  var p = memory.pointers[id]
  var data = t.data
  var didx = t.ads[p]
  var arr = []
  var size = data[didx]
  var idx = didx + 2
  while ( idx < didx + size ) {
    arr.push(data[idx++])
  }
  return arr
}
function fstCharNotZero(str){ return str[0] !== '0' }
function topolynom(a){
  var arr = toarr(a)
  var c = arr.shift()
  var p1 = arr.shift()
  p1 = p1 ? p1 : false
  var rest = arr.length ? arr.map(topoly).filter(fstCharNotZero) : []
  return '(' + c + ( p1 ?  '+' + p1 + '*(2^16)' : '' ) + (rest.length ? '+' + rest.join('+') : '') + ')'
}
function toop(a, b, op){
  var A = topolynom(a)
  var B = topolynom(b)
  return 'convert ' +A + op + B + ' to base 67108864'
}
function findlast(ta){
  var last = 0
  for ( var i = 0; i < ta.length; i++ ) {
    if ( ta[i] > 0 ) last = i
  }
  return last
}
function value(obj){ return obj.value }
function topoly(c, p){ return c + '*' + '(2^16)^' + p }
function toarr(id){
  var t = memory.values[id]
  var p = memory.pointers[id]
  var data = t.data
  var didx = t.ads[p]
  var arr = []
  var size = data[didx]
  var idx = didx + 2
  while ( idx < didx + size ) {
    arr.push(data[idx++])
  }
  return arr
}
function topolynom(a){
  return '(' + toarr(a).map(topoly).join('+') + ')'
}
function tomul(a, b){
  var A = topolynom(a)
  var B = topolynom(b)
  return 'convert ' +A + '*' + B + ' to base 67108864'
}

function num(arr){
  var id = memory.numbers(arr.length + 2)
  var t = memory.values[id]
  var p = memory.pointers[id]
  var data = t.data
  var didx = t.ads[p]
  data[didx + 1] = 0
  for ( var i = 2; i < data[didx]; i++ ) {
    data[didx + i] = arr[i - 2]
  }
  return id
}
function size(index){
  return [index, memory.stacks.data[memory.stacks.ads[index]]]
}

function second(tuple){ return tuple[1] }

function max_size(sizes){
  return max.apply(sizes.map(second))
}

function get_max_size(){
  var sizes = map(memory.stacks.ads, size)
  console.log(sizes)
  return max_size(sizes)
}
*/


