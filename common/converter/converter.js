/**
 * app启动就加载定义的转换器
 */
const convertManager=require('./converter-manager.js')

convertManager.name={
  getSentence:'getSentence'
}

//句子时间戳从大到小排序
convertManager.addConverter(convertManager.name.getSentence,function(d){
  d.data.sort(function(a,b){
    let dateA=new Date(a.time)
    let dateB=new Date(b.time)
    return dateB - dateA
  })
  return d
})
