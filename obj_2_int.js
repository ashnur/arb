
  function obj_2_uint16(obj){
    obj.length = Object.keys(obj).length
    obj = slice(obj)
    var arr = pool(obj.length)
    obj.forEach(function(bigit, i){
      arr[i] = bigit
    })
    return arr
  }
