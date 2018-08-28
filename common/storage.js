/**
 * 本地存取对象
 */
const key = {
  navigationBarColor: 'navigationBarColor',
  userID: 'user_id',
  talk: 'talk'
}

const setCache = (name, obj) => {
  try {
    wx.setStorageSync(name, obj)
  } catch (e) {
    //当存取失败不做处理，只打印错误
    console.log(e)
  }
}

const getCache = (name) => {
  try {
    var obj = wx.getStorageSync(name)
    return obj
  } catch (e) {
    console.log(e)
  }
}

//存储user_id
const setUserID = user_id => {
  setCache(key.userID, user_id);
}

const getUserID = () => {
  return getCache(key.userID);
}

/**
 * 设置和获取当前页面的导航栏颜色
 */
const setNavigationBarColor = () => {
  var navigationBarColor = getCache(key.navigationBarColor);
  if (navigationBarColor) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: navigationBarColor
    })
  } else {
    setCache(key.navigationBarColor, '#FF4500');
  }
};
const getNavigationBarColor = () => {
  var navigationBarColor = getCache(key.navigationBarColor);
  return navigationBarColor;
};
/**
 * 存取 言语 页面的聊天记录
 */
const setTalk=(obj)=>{
  setCache(key.talk,obj)
}

const getTalk=()=>{
  return getCache(key.talk)
}

module.exports = {
  setNavigationBarColor,
  getNavigationBarColor,
  setUserID,
  getUserID,
  setCache,
  getCache,
  setTalk,
  getTalk
}