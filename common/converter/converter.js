/**
 * app启动就加载
 */
const convertManager=require('./converter-manager.js')
convertManager.name={
  getSentence:'getSentence'
}
convertManager.addConverter(convertManager.name.getSentence,function(data){
  return data+' world'
})
