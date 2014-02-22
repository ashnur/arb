void function(){
  // thanks to ImBcmDth http://jsfiddle.net/ImBcmDth/LtZS7/3/
  // Stolen from http://graphics.stanford.edu/~seander/bithacks.html

  var MultiplyDeBruijnBitPosition = [
      0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8,
      31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9
  ]

  function trailing(a){
    // ..seems to work for 16 bit numbers too, no warrantee!
    var l = 0
    for (var i = 2; i < a.length; i++) if (a[i] !== 0) break
    l = (i - 2) * 16
    n = a[i]
    l += MultiplyDeBruijnBitPosition[((n & -n) * 0x077CB531) >>> 27]
    return l
  }

  function leading(a) {
    var v = a[a.length - 1]
    return v == 0 ? 16
         : 16 - a.toString(2).length
    return v == 0 ? 16
         : v == 1 ? 15
         : 16 - Math.ceil(Math.log(v)/Math.LN2)
  }



  module.exports.trailing = trailing
  module.exports.leading = leading
}()
