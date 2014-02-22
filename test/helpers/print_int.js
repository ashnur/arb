void function(){
  function walkfrom_2(arr){
    for ( var i = 2, r = ''; i < arr.length; i++ ) {
      r = r + ', ' + arr[i]
    }
    return r
  }

  function sign(arr){
    return arr[0] == 0 ? '+' : '-'
  }

  function print(n, arr){
    return console.log(n + ', size: ' + arr[1] + ', ' + sign(arr) + walkfrom_2(arr) )
  }
  module.exports = print
}()
