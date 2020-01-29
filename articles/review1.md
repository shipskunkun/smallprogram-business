# 某纯正商业级应用小程序项目总结




### 1.项目简介

一款在线浏览图片、文章、音乐，豆瓣图书，我的个人信息等功能 小程序

+ 在线浏览图片、文章、音乐
+ 豆瓣图书
+ 我的个人信息


### 2. 主要工作和疑难点汇总

#### 2.1 主要工作

1. 封装api请求，改造wx.requeset方法，封装http请求
2. 封装每个页面的server请求
3. 抽取公共组件，如喜欢组件、loading、mask等，通过在各个页面配置usingComponents参数使用。
4. 封装全局公共函数
5. 业务逻辑



#### 2.2 业务亮点


#### 2.3 疑难点汇总

1. 小程序中图片如何处理
	
		统一存在于pages同级的文件夹，images中，并按照功能模块，划分为几个文件夹，book/ icon/ my/ tab

2. 小程序中每个页面的请求怎么处理？
		
		统一存在于pages同级的文件夹，models中，并按照功能模块，把请求写在主要的几个js文件中，每个js文件包含一个模块的请求


	
3. 小程序几个组件  
4. 利用缓存
      		

### 4. 业务逻辑梳理
#### 4.1 项目哪几个page组成？有几个组件？  
	
| 16个page  | 5个组件 |
|  ----  | ----  |
| classic | 首页，第一个tabBar |
| book  | 第二个tabBar |
| my | 第三个tabBar |
| classic-detail |  |
| boo-detail |  |
| about  |  |
| course |  |
|  |  |

| classic | 首页，essay、movie、music 组件 |
| episode | 首页日历组件|
| image-button | 首页button组件 |
| like | 首页点赞组件 |
| navi | 首页前进后退组件|
| behaviors |  |
| book |  |
| loading |  |
| mask| |

| preview | |
| search | |
| tag | |
	
	
	
### 5. 几个页面

> 1. 首页classic

#### 1.1classic 页面用到的组件

 1. v-episode
 	
 	注意点：
 	
	 + 对付组件传过来的值，做处理，使用 observer
	 + 使用observer的注意点，不能在 observer，setData 原来的数据，会导致递归
	 + this.months[ new Date().getMonth()]
 
	 ```
	 properties: {
	    index:{
	      type:String,
	      observer:function(newVal, oldVal, changedPath){
	        let val = newVal < 10?'0'+newVal:newVal
	        this.setData({
	          _index:val
	        })
	      }
	    }
	  },
	 ```	
 	
 	
 2. v-like
 	
 	+ 三元表达式，修改图片
 	
 		```
 		<image src="{{like ? yesSrc : noSrc}}" />
 		```
 	+ triggerEvent 向父组件报告，喜欢 or 取消喜欢 这个动作，然后在父组件中发送数据请求，把请求放在父组件中
 	+ 组件内部的图片，放在组件内部的 images 文件夹中， like/images
 	
 3. v-button 
 		没啥说的
 4. v-movie 没啥说的
 5. v-essay 没啥说的
 6. v-mousic
 	
 	+ 获取当前音频播放对象
 	+ 对当前音频播放、暂停，换封面的控制
 		
 		
 7. v-navi
	
	+ 通过判断是否是第一张，是否是最后一张，控制，后退，前进，按钮的样式
	+ getLatest， 请求逻辑
	+ 使用缓存是怎么处理的
 		
 		 

####  1.2classic 页面

1. 当cid 存在的时候，代表啥意思？请求，getById 是怎么操作的  

2. 抽取，向前，向后操作，共同部分，发送请求

3. 我真的服了这个作者，切换navi 组件，向左是next, 向右是 previous， 是按照时间倒序排列算的吗？
4. 对实时性要求不高的数据，setStorageSync 先存储起来，然后getStorageSync 获取

> 2. book 页面

####  2.1 book组件

1. v-book 组件

	点击会跳转到 book-detail 组件

2. v-search 组件







功能：显示搜索书籍框，点击搜索，显示搜索页面，否则默认展示book数组

1. book页面onReachBottom 中，有个功能是 more: random(16)， 什么意思
	
	14TSNJH7ZVEX3DMR
	R8YSX95EZ97ZAT7N
	
	获取16位，由数字和字符串组成的，乱序代码

2. 
		 
 		 
> 3. book 详情页面
 		 
 		 
 		 
 		 
 		 
 		 
 		 

### 6. 问题汇总解答


#### 1. 如何在小程序中使用less，可以实时转化为 .wxss文件？

微信小程序只支持原生css写法，但是很浪费时间，使用 wxss-cli 可以实时将编写的 .less 文件自动编译为 .wxss 文件

1、npm或者yarn全局安装wxss-cli

```
npm install -g wxss-cli
```
2、运行wxss-cli命令(miniProject为小程序目录)，less文件保存时自动编译

```
wxss ./miniProject
```

[参考资料](https://developers.weixin.qq.com/community/develop/doc/00086c05ce0b780c3d072925955c06)

#### 2. 小程序Page里的函数比app.js先执行的解决办法

问题描述：
当我们初始化一个小程序时，默认文件 app.js 中有onLaunch函数，

```
onLaunch: function () {
	console.log("onLaunch");
	wx.login({
      success: res => {
        console.log("login");
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
}
```

默认目录，"pages/index/index", 中index.js 有 onLoad函数

```
onLoad: function () {
    console.log("index onLoad");
}

```

小程序网络请求默认为异步请求，在app.js的onLaunch运行后进行异步请求时，程序不会停止，index.js页已执行onload, onload里面的数据会因为没有获取到app.js里的东西而报错, 我们希望onLaunch执行完后再执行onLoad。

他们的执行顺序是，onLaunch > index onLoad > login  
我们希望的执行顺序是：
onLaunch >  login > index onLoad 




解决办法
 
1. 定义回调函数, onload里获取不到东西就一直获取，不执行下一步操作，直到获取到app.js的数据才继续执行。若login返回为空，则给app.js注册一个loginSuccessCallback回调，这个回调方法的执行时机，就是app.js中的异步请求完毕

2. 把 app.js 中的 onLaunch 中方法拿到 index.js 文件中，按照自己的逻辑写
3. 使用promise


方法1：

```
App({
  onLaunch: function () {
    wx.login({
      success: res => {
        this.globalData.checkLogin = true;
        //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.checkLoginReadyCallback){
          this.checkLoginReadyCallback(res);
        }
      }
    })
  },
  globalData: {
    checkLogin: false
  }
  
  ...
})
 

//index.js
//获取应用实例
const app = getApp()
 
Page({
  data: {
    test: false
  },
  onLoad: function () {
    let that = this;
    //判断onLaunch是否执行完毕
    if (app.globalData.checkLogin){
      that.setData({
        test:true
      })
    }else{
      app.checkLoginReadyCallback = res => {
      	  //登陆成功后自己希望执行的，和上面一样
        that.setData({
          test:true
        })
      };
    }
  }
})

```


方法2：
把 app.js 中的 onLaunch 中登陆后才执行的方法拿到 index.js 文件中，这是最简单的方法

```
//index.js

onLoad: function () { 
	wx.login({
	  success: res => {
	    resolve(res); 
	  }
	})
}

```


方法3：

```
// app.js中定义一个新的方法
App({
  onLaunch: function () {
  	...
  },
  getAuthKey: function (argument) {
    var that = this;
    return new Promise(function(resolve, reject){
        wx.login({
          success: res => {
            resolve(res); 
          }
        })
    })
  }
  ...
  
})

//index.js
onLoad: function () {
    ...
        
    app.getAuthKey().then(function(res){
      console.log('res')
    })
 }

```





参考资料：  [参考1](https://blog.csdn.net/zuorishu/article/details/94441997)  [参考2](https://blog.csdn.net/vipbin520/article/details/84099338) [参考3](https://blog.csdn.net/qq_34289109/article/details/88615276)

####3. fixed 元素 auto 必须要同时设置 top、left

```
position: fixed;
top: 132rpx;
left: 30rpx;
width: 690rpx;
margin: 0 auto;

```

#### 4.封装一个有输入框的modal层组件

其实很简单，就是在modal中添加新的 input, 

```
<view>
    <modal class="modal" wx:if="{{!hiddenModal}}"
     title="{{title}}" confirm-text="确定" cancel-text="取消" bindconfirm="modalconfirm" bindcancel="modalcancel">
        <view class="input-line">
            <input placeholder='请输入内容' maxlength="{{ maxlength }}" bindinput='input' type="text" type="text"  value="{{ textvalue }}" />
            <text>{{ currentlength}}/{{ maxlength }}</text>
        </view>
    </modal>
</view>

.modal{
    width: 540rpx;
    max-width: 540rpx;
    border-radius: 28rpx;
    .input-line {
        display: flex;
        border: 2rpx solid rgba(0, 0, 0, 0.05);
        font-size: 28rpx;
        padding: 16rpx;
        height: 40rpx;
        line-height: 40rpx;
    }
    input,  text{
        display: inline-block;
        vertical-align: top;
    }
    input {
        flex: 1;
    }
    text {
        width: 90rpx;
        color: #FFA004 ;
    }
}


```


####  5.微信小程序去除button默认边框样式

```
button::after{
	border: none;
}

```

#### 6.小程序如何获取点击元素信息

使用驼峰模式，给点击元素绑定 data-***，通过 event.currentTarget.dataset 获取

```
<image src="{{ item.mini_pic }}" class="{{ item.show_opacity ? 'show_opacity' : ''}}" bindtap="tap" data-message="{{ item }}">
</image>

// 获取的点击节点元素是一个对象
 tap: function(event) {
    var message = event.currentTarget.dataset.message;
}
```


#### 7. 小程序如何在页面间传递数组对象？

方法1：A页面跳转链接添加参数，B页面onLoad 接受
方法2：设置全局变量 globalData，用的少，一般适用于全局共享的一份信息，如用户open_id等

```
// A页面
// 数组、对象都需要stringify
var listData = JSON.stringify(that.data.listData)
var taskArray = JSON.stringify(that.data.taskArray)
wx.navigateTo({
	url: '../workRecord/updateBatch?listData=' + listData + '&taskArray=' + taskArray 
})

//B页面
onLoad: function (options) {
    var that = this
    var listData = JSON.parse(options.listData)
    var taskArray = JSON.parse(options.taskArray)
}



//A页面：
app.globalData.open_id = 3;
//B页面：
var lala = app.globalData.open_id;

```



#### 8. 小程序如何批量上传图片	
		chooseImage、的回调函数中，wx.uploadFile
		上传，更新进度




### 6. 其他

1. 封装http请求

		class HTTP{
				    request({url,data={},method='POST', header={'content-type':'application/json'} }){
				        return new Promise((resolve, reject)=>{
				            this._request(url,resolve,reject,data, method, header)
				        })
				    }
				    _request(url,resolve, reject, data={}, method='POST', header){
				        wx.request({
				            url:url,
				            method:method,
				            data:data,
				            header: header,
				            success:(res)=>{
				                const code = res.statusCode.toString()
				                if (code.startsWith('2') && res.data.errno == 10000){
				                    resolve(res.data)
				                }
				                else{
				                    if(res && res.data && res.data.errmsg) {
				                        this._show_error(res.data.errmsg)
				                    }
				                    else {
				                        this._show_error(tips[1])
				                    }
				                    console.log('错111111111')
				                    reject(res)
				                }
				            },
				            fail:(err)=>{
				                reject(err)
				                console.log('错22222222')
				                this._show_error(tips[1])
				            }
				        })
				
				    }
				
				    _show_error(tip){
				        if(!tip){
				            tip = tips[1]
				        }
				        wx.showToast({
				            title: tip,
				            icon:'none',
				            duration:2000
				        })
				    }
				}

















