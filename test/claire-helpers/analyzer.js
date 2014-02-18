void function(){
  var liberate = require('liberate')
  var map = liberate(Array.prototype.map)
  var slice = liberate(Array.prototype.slice)
  var each = liberate(Array.prototype.forEach)
  var sign = require('../../sign.js')
  var log = console.log.bind(console)


  function toString(result){
//log('x', Object.keys(result)[0])
    return Object.keys(result).map(function(title){
      return  '\n' + title + ' → ' + Object.keys(result[title]).map(function(trait){
        return trait + ': ' + result[title][trait][1]
      }).join (' | ')
    }).join(' | ')
  }

  function combine(acc, traits){
    var r = traits.map(function(trait){
      var title = trait[0]
      if ( acc[title] == null ) acc[title] = {}
      var name = trait[1]
      var value = trait[2]
      acc[title][name] = (acc[title][name] && (acc[title][name][0] > value[0])) ? acc[title][name] : value
    })
//log('x', Object.keys(acc)[0])
    return acc
  }



  function analyzer(){
    // some arguments which represent the data to be described
    // making groups of the same types
    var types = slice(arguments)
    return function(){
      // matching up the arguments here with the outer ones
      // groups results should be reduced to 1 result
      var args = slice(arguments)
      var result = types.map(function(type, i){
        return type[1].map(function(trait){
          return [type[0], trait.name, trait.describe(args[i])]
        })
      })
//log('1', result)
      result = result.reduce(combine, {})
//log('2', result)
      // this returns a string
      return toString(result)

    }
  }


  module.exports = analyzer

}()





