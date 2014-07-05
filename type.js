module.exports = type2bits

function type2bits(type){
  if ( type == 'integer' ) return 0 // 0
  if ( type == 'rational' ) return 2 // 10
  if ( type == 'polyinteger' ) return 14 //1110
  if ( type == 'polyrational' ) return 30 //11110
  return 0
}
