/**
 * 
 * 使转换器和处理器解耦
 * 
 * 添加转换器
 * ConverterManager.addConverter('name',function(data){
 *  //处理原data
 * })
 * 
 * 调用处理器（处理转换后的数据）
 * ConverterManager.handler('name',preData,function(data){
 * 
 * })
 */

function ConverterManager(){
}

ConverterManager.prototype.key=[]
ConverterManager.prototype.converter={}

ConverterManager.prototype.addConverter=function(name,fun){
  //判断转化器是否已有
  if(!name||name.trim()===''||this.key.includes(name)){
    throw 'params err'
  }
  //加入转化器容器
  this.key.push(name)
  this.converter[name]=fun
}

ConverterManager.prototype.delConverter=function(name){
  if(key.includes(name)){
    this.key.splice(key.indexOf(name),1);
    delete this.converter[name];
  }
}

ConverterManager.prototype.handler=function(name,data,fun){
  if(this.key.includes(name)){
    let d=this.converter[name](data) 
    fun(d)
  }
}
ConverterManager.prototype.getInstance=function(){
  let converterManager
  if(!converterManager){
    converterManager=new ConverterManager();
  }
  return converterManager
}

let convertManager = ConverterManager.prototype.getInstance()

module.exports = convertManager

