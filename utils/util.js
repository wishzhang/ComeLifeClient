const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将jokes数组的对象的publishTime属性值（为时间戳字符串）转换为
 * xxxx-xx-xx xx:xx
 */
const jokesConvertTime=jokes=>{
  return jokes.map(function (e) {
    var date = new Date(e.publishTime);
    e.publishTime = formatTime(date);;
    return e;
  }); 
}

module.exports = {
  jokesConvertTime: jokesConvertTime
}
