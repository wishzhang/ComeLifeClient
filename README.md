#### 开发思路（设计实现）
- 先把主流程走通

- 开发环境：微信开发者工具  

- 前端：
代码结构分为配置文件和源码文件。源码可以分为拥有不同职责的对象。  
如：页面一个个组件对象，一个组件内部分发送请求对象，处理数据对象等。 

- 一个页面的编写：
	- 一个页面可由那4个文件类型组成（命名相同）
	- 每个页面需在app.json那里配置文件路径
	- 视图层（WXML,WXS,WXSS）和逻辑层(WXJS),解耦

#### 代码管理
git,github

#### 全局配置
app文件

#### 頁面開發
- home 主页
  - 頁面描述：用户查看段子
	- 数据实体(后端采用mongoose数据库)
		- 发布的段子：用户名（保证唯一），用户头像，段子内容，段子发布时间，段子ID(hide)
	- 展示内容：所有发布的段子（段子不包括段子ID），以滚动列表的形式展示
- mine 我的
	- 页面描述：用户个人中心
	- 展示内容：用户头像，用户名，我的投稿（作为管理我的段子的入口）
- contribution 我的投稿
  - 頁面描述：用戶自身投稿的段子的歷史記錄，顯示段子內容和投稿時間，以列表形式展示
- jokeAdd 添加段子界面
	- 页面描述：有一个编辑框和一个发布提交按钮

- linger 逗留
	- 页面描述：提供温度
	- 展示内容：言语，轨迹，不懂，青果，功能入口。并以列表形式展示句子迷。

- olive 青果
	- 页面描述：目的是目标管理，这里先实现日记，周记，月记
	- 数据结构：日记实体包含内容，生成时间，和个人关联。其他类似。
	- 页面展示：

- talk 言语
- msg 个人信息
- collection 我的收藏
	- 页面描述：在‘主页’浏览，点击心型图标收藏，将收藏内容以列表形式展示
- feedback 反馈与建议
	- 页面描述：入口在‘我的’，页面包含：反馈文本，邮箱信息。



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
组件：是一个功能体(页面，数据，行为等结合)，并能很好地扩展和与其他组件相配合。  
定义流程：在json配置，在wxml，wxss编写页面(注意自定义组件引用不了app.wxss全局样式)，在js代码
定义Component,定义值和方法（提供给父组件的方法在method中定义，Component传入的对象是固定key），在attached生命周期，触发childobj事件，将this传入。(注意，作为子组件，在method中定义的onLoad,onShow等不会被回调)  
关键：在于接口。

- 有温度的程序功能(linger逗留)
	- talk(言语)：初次实现人机基本聊天，聊天的方向：温度
	- 轨迹：初次实现给用户随便写，作用：和言语作用一样舒缓情绪，但用户开始有自己的思考
	- 不懂：初次实现管理用户遗留的问题，暂不提供解答。
	- 青果：初次实现管理用户的打算，日周月和长远的事情

- 我的收藏
	- 思路：每个收藏品有它唯一_id,将_id放进用户信息的收藏集合中，通过collectionadd接口向后端添加；展示时看其_id是否存在于用户收藏集里。
	- 微信坑人的框架啊*_*，一定要好好搞Vue才行。data的数据设置。
- 用户身份标志
	- 思路：采用服务器端分配token保存在数据库，客户端保存在缓存中，所以用户身份和文件相对应（但文件是用户相隔离的）。由于缓存可能被清楚，每次请求都响应和保存token.(虽然不安全)

#### 接口文档(根据Postman工具维护)
<table>
<tr>
<th>请求方法</th>
<th>路径</th>
<th>参数</th>
<th>响应例子</th>
<th>描述</th>
<td>可用</td>
</tr>

<tr>
<td>get</td>
<td>/jokeAdd</td>
<td>userID,jokeContent</td>
<td>成功：{code:0,msg:'success'}失败：{code:1,msg:'failed'}</td>
<td>提交段子</td>
<td>否</td>
</tr>

<tr>
<td>get</td>
<td>/jokeGet</td>
<td>userID</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取用户自身发布的所有段子</td>
<td>否</td>
</tr>

<tr>
<td>get</td>
<td>/jokeGetAll</td>
<td>无</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...总之是数据库里的一条段子记录}]}</td>
<td>获取所有用户自身发布的所有段子</td>
<td>否</td>
</tr>

<tr>
<td>get</td>
<td>/getJokesByPage</td>
<td>userID&isALL=1&page=1</td>
<td>成功：{code:0,msg:'success',data:[{userID:'ZW',...是数据库里的段子记录}]}</td>
<td>根据参数，获取对应的段子，</td>
<td>否</td>
</tr>

<tr>
<td>post</td>
<td>/userJokeAdd</td>
<td></td>
<td></td>
<td>添加段子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/allUserJoke</td>
<td></td>
<td></td>
<td>获取所有段子</td>
<td>是</td>
</tr>


<tr>
<td>post</td>
<td>/oneUserJoke</td>
<td></td>
<td></td>
<td>获取个人发布的段子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/jokeCollectorAdd</td>
<td></td>
<td></td>
<td>添加到我的收藏</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/jokeCollectorRemove</td>
<td></td>
<td></td>
<td>从我的收藏删除</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/getUserCollections</td>
<td></td>
<td></td>
<td>获取我收藏的所有段子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/addFeedback</td>
<td></td>
<td></td>
<td>提交投诉与建议</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/addSentence</td>
<td></td>
<td></td>
<td>提交句子</td>
<td>是</td>

<tr>
<td>post</td>
<td>/getSentences</td>
<td></td>
<td></td>
<td>获取所有句子</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/addOlive</td>
<td>user_id，oliveContent</td>
<td></td>
<td>添加青果</td>
<td>是</td>
</tr>


<tr>
<td>post</td>
<td>/editOlive</td>
<td>olive_id，oliveContent</td>
<td></td>
<td>编辑青果</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/deleteOlive</td>
<td>olive_id</td>
<td></td>
<td>删除青果</td>
<td>是</td>
</tr>

<tr>
<td>post</td>
<td>/getOlives</td>
<td>user_id</td>
<td></td>
<td>获取所有青果</td>
<td>是</td>
</tr>


</table>

#### 软件控制(硬件和产品需求)
- 硬件
	- 以iPhone6作为视觉稿标准（rpx换算成px来适应，1rpx=0.5rpx,那么1rpx就可以为1物理像素了）
	- 文件，数据缓存都有限

- 需求
	- 理念：一个有温度的程序，和你一起积极面对生活
	- 关注点：1.问合理的问题（如关注优点)

#### 問題解決（未解決:- 已解決：+ 微信bug:*）
+tabBar的顯示，需要調用switchTab方法，通過百度搜索和查看文檔解決  

-在view标签下放了水平弹性盒子，盒子内容竟然水平居中了，去掉view就回复正常  

+margin所占的空間也有他的background-color -_-...（用空view填充）  

+微信 template 的属性data，当前文档规定 传入的数据必须是可以转成 JSON 的格式，而定义的function函数无效？x,page({data:{}})的data仅支持可JSON的数据，所以WXML页面上的数据规定和page里的data关联（而data定义不了函数），WXML上的函数和page里的函数关联，另一种表现形式是WXS,没去试（不过都要在Page()里注册）。最后还是一条条分开来写吧。  
-列表点击事件还是没解决...  
-发布段子jokeAdd页面的textarea,bug:文字不转行  
-兩邊固定像素，中間撐滿的佈局  
+flex佈局，若width不固定，justify-content:space-between設置不了?可以滴  
  
-网络请求数据导致页面加载过慢，并且出现白页。  
这里应该采用二级缓存：缓存查找，若有则显示，接着进行网络请求数据，将响应的记录和本地记录比较，新的记录显示出来，最后也把缓存更新一下。  

*在列表循环中的item的bindtap事件e.target无效。  
+代码加载机制：从App({})开始，创建app实例，并根据app.json文件加载各个page代码执行。  
-wx.setNavigationBarColor只对当前页面有效，有两种办法：  
1.动态改变app.json配置文件  
2.每个页面加载一份初始化代码（能重写Page么？？？），这条错了，要在onShow才行啊。。。
