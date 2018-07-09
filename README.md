#### 开发思路（设计后在实现）
- 先把主流程走通

- 开发环境：微信开发者工具  


- 前端：编写页面和页
面间数据的传递，页面交互
代码结构分为配置文件和源码文件  
对于源码：每个页面由一个文件夹组织（命名相同），文件是单独作用域，为模块。



- 一个页面的编写：
	- 一个页面可由那4个文件类型组成（命名相同）
	- 每个页面需在app.json那里配置文件路径
	- App和Page方法，生命周期，实例，事件处理，页面管理，模块化
	- 视图层（WXML,WXS,WXSS）和逻辑层(WXJS),解耦

#### 代码管理
git,github

#### 全局配置
- 小程序标题：望梅止渴
- 主题颜色：青梅 #1d7f0a
- 次主题颜色：黄梅 #e99f18
- 背景颜色：#fff
- 次背景顏色 #FAFAFA
- 字体主颜色：待定
- 字体次颜色：#aaa
- 标题字体大小：待定
- 正文字体大小：待定
- 注释字体大小：

#### 頁面開發
- home
  - 頁面描述：用户查看段子
	- 数据实体(后端采用mongoose数据库)
		- 发布的段子：用户名（保证唯一），用户头像，段子内容，段子发布时间，段子ID(hide)
	- 展示内容：所有发布的段子（段子不包括段子ID），以滚动列表的形式展示
- mine
	- 页面描述：用户个人中心
	- 展示内容：用户头像，用户名，我的投稿（作为管理我的段子的入口）
- contribution
  - 頁面描述：用戶自身投稿的段子的歷史記錄，顯示段子內容和投稿時間，以列表形式展示
- jokeAdd
	- 页面描述：有一个编辑框和一个发布提交按钮

- linger
	- 页面描述：提供温度
	- 展示内容：言语，轨迹，不懂，青果，功能入口。田字格先放着。

#### 页面功能
- 上拉下拉实现  
思路：上拉和下拉的接口分开(前端只实现上拉列表就好)。  
前端维护一个数组arr，每次请求‘上拉’接口，
将响应返回的目标数组，插入到arr。  
后端维护一个用户数据响应情况对象obj， 从数据库查询该用户的全部目标数据（当请求带上首次标志参数时），将用户id和全部目标数据放到obj中。每次请求处理：将对应用户的下一页数据返回。  
>     arr=[{},{}];
>     
>     obj={
>     		currentPage:0,
>     		num:3,
>     		data:[{},{}]
>     };

- 自定义组件  
组件：原来WX也可以，组件应该是一个功能体(页面，数据，行为等结合)，并能很好地扩展和与其他组件相配合。  
定义流程：在json配置，在wxml，wxss编写页面(注意自定义组件引用不了app.wxss全局样式)，在js代码
定义Component,定义值和方法（提供给父组件的方法在method中定义，Component传入的对象是固定key），在attached生命周期，触发childobj事件，将this传入。(注意，作为子组件，在method中定义的onLoad,onShow等不会被回调)  
关键：在于接口。

- 有温度的程序功能(逗留)
	- 言语：初次实现人机基本聊天，聊天的方向：温度
	- 轨迹：初次实现给用户随便写，作用：和言语作用一样舒缓情绪，但用户开始有自己的思考
	- 不懂：初次实现管理用户遗留的问题，暂不提供解答。
	- 青果：初次实现管理用户的打算，日周月和长远的事情

#### 接口文档
<table>
<tr>
<th>请求方法</th>
<th>路径</th>
<th>参数</th>
<th>响应例子</th>
<th>描述</th>
</tr>

<tr>
<td>post</td>
<td>/jokeAdd</td>
<td>userID,jokeContent</td>
<td>成功：{code:0,msg:'success'}失败：{code:1,msg:'failed'}</td>
<td>提交段子</td>
</tr>

<tr>
<td>post</td>
<td>/jokeGet</td>
<td>userID</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取用户自身发布的所有段子</td>
</tr>

<tr>
<td>post</td>
<td>/jokeGetAll</td>
<td>无</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取所有用户自身发布的所有段子</td>
</tr>
</table>

#### 問題解決（未解決:- 已解決：+）
+tabBar的顯示，需要調用switchTab方法，通過百度搜索和查看文檔解決  

-在view标签下放了水平弹性盒子，盒子内容竟然水平居中了，去掉view就回复正常  

+margin所占的空間也有他的background-color -_-...（用空view填充）  

+微信 template 的属性data，当前文档规定 传入的数据必须是可以转成 JSON 的格式，而定义的function函数无效？x,page({data:{}})的data仅支持可JSON的数据，所以WXML页面上的数据规定和page里的data关联（而data定义不了函数），WXML上的函数和page里的函数关联，另一种表现形式是WXS,没去试（不过都要在Page()里注册）。最后还是一条条分开来写吧。  
-列表点击事件还是没解决...  
-发布段子jokeAdd页面的textarea,bug:文字不转行  
-兩邊固定像素，中間撐滿的佈局  
+flex佈局，若width不固定，justify-content:space-between設置不了?可以滴  
  
-网络请求数据导致页面加载过慢，并且出现白页。  
这里应该采用二级缓存：本地外存查找，若有则显示，接着进行网络请求数据，将响应的记录和本地记录比较，新的记录显示出来，最后也把本地存储更新一下。
(每条记录有key)  
设计：采用全局变量的方式(也可以单例)  
//url为一类记录，url+keyValue为一条记录
app.FetchData={
	key:'',
	setKeyName:function(keyName){
		this.key=keyName;
	},
	get:function(host,params){
		var url=convertToUrl(host,params);
			
	},
	convertToUrl:function(host,params){
		host+='?';
		for(var item in params){
			if(params.hasOwnProperty(item)){
				host+=item+'='+params[item]+'&';
			}
		}
		
	}
}