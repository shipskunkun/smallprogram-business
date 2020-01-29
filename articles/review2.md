
## todolist

search 组件    
tag 组件  
promisic 函数 怎么回事  
页面也能作为组件，是怎么回事？


## 7 course 页面
	无


## 6. my 页面

### Q: slot 的使用
	到底是默认有，还是没有？

### Q: 怎么就获得了登录用户的头像和昵称？？？？
	如果没有授权，就调用
	
	<button bind:getuserinfo="onGetUserInfo" open-type='getUserInfo' 
	 plain='{{true}}'class="container">
    </button>
    	
	bindgetuserinfo, 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与 
	wx.getUserInfo返回的一致，open-type="getUserInfo"时有效

### Q: v-preview 组件
	// 通过 变量值 控制样式
	<image class="{{classic.type==200?'music-img':'other-img'}}" src="{{classic.image}}"></image>

### Q:  onShow()
	
	页面显示/切入前台时触发。



### Q:  promisic 函数？


## 5. about页面
	
### Q: 打开另一个小程序？

open-type="navigate"     
appId   要打开的小程序 appId  
target="miniProgram" 其它小程序  
	
```
<navigator class="nav" target="miniProgram" app-id="wx8ffc97ad5bcccc89" open-type="navigate">
 	<image class="vendor" src="/images/my/vendor.png"></image>
</navigator> 
```
## 4. classic-detail 页面

### Q: 页面也能作为组件？

```
"usingComponents": {
    "v-classic":"/pages/classic/classic"
  }

```


## 3.book-detail 页面

### Q:v-tag 短评组件？


### Q: 过滤器文件 exports 方法？

```
var highlight = function(index){}

module.exports = {
    highlight:highlight
}

使用： moduleName. highlight()
```


### Q: wx:for 的使用，item?

都没有item、 key 中怎么也绑定的不是  item.content? 

语法： 默认 item、index， wx:key 取 item中某个属性

在组件上使用 wx:for 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。
默认数组的当前项的下标变量名默认为 index，数组当前项的变量名默认为 item


wx:key 的值以两种形式提供
字符串，代表在 for 循环的 array 中 item 的某个 property，该 property 的值需要是列表中唯一的字符串或数字，且不能动态改变。
保留关键字 *this 代表在 for 循环中的 item 本身，这种表示需要 item 本身是一个唯一的字符串或者数字，如：



```
<block wx:for="{{util.limit(comments, 10)}}" wx:key="content">
	<v-tag tag-class="{{tool.highlight(index)}}" text="{{item.content}}">
	    <text class="num" slot="after">{{'+'+item.nums}}</text>
	</v-tag>
</block>

```



### Q: loading 组件使用

```
wx.showLoading()
wx.hideLoading()

```

### Q: wx 计算属性 or 过滤器？

过滤器吧，应该是

```
<wxs src="../../util/filter.wxs" module="util" />

<block wx:for="{{util.limit(comments, 10)}}" wx:key="content">
               
```

### Q: promist.all 用法？
```
	const detail = bookModel.getDetail(bid)
    const comments = bookModel.getComments(bid)
    const likeStatus = bookModel.getLikeStatus(bid)


    Promise.all([detail, comments, likeStatus])
      .then(res => {
         wx.hideLoading()
      })
```

## 2. book.wxml 页面

### Q:book 页面，循环列出图片

如何换行？两个一行，多了换行？样式怎么写
flex-wrap: wrap


图d-1

![](https://github.com/shipskunkun/small-program/blob/master/articles/images/d-1.png?raw=true)


```
<block wx:key="id" wx:for="{{books}}">
    <v-book book="{{item}}" />
</block>


.books-container {
    margin-top: 10rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 90rpx;
}
```






## 1. classic.wxml 页面

### Q: 分享按钮，获取信息？

```
//slot 的使用
<v-button class="share-btn" open-type="share">
    <image class="share" slot="img" src="/images/icon/share.png" />
</v-button>

//用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与wx.getUserInfo返回的一致，open-type="getUserInfo"时有效

// button 的属性
open-type="share"

//open-type 的合法值
share	触发用户转发，使用前建议先阅读使用指引

bindgetuserinfo  
用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与wx.getUserInfo返回的一致，
open-type="getUserInfo"时有效
```

### Q: behavior使用

```
import { classicBeh } from '../classic-beh.js'
behaviors: [classicBeh],
```

### Q: slot 的使用

```
<v-button class="share-btn" open-type="share">
    <image class="share" slot="img" src="/images/icon/share.png" />
</v-button>

// 通过name
<button bind:getuserinfo="onGetUserInfo" 
    open-type='{{openType}}'  plain='{{true}}'
     class="container">
  <slot name="img"></slot>
</button>
```

### Q: 父组件怎么向子组件传值的？
```
<v-episode class="episode" index="{{classic.index}}" />

传了个 index 方在 properties 中了


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


### Q:attached?
组件的生命周期，指的是组件自身的一些函数，这些函数在特殊的时间点或遇到一些特殊的框架事件时被自动触发。

其中，最重要的生命周期是 created attached detached ，包含一个组件实例生命流程的最主要时间点。

组件实例刚刚被创建好时， created 生命周期被触发。此时，组件数据 this.data 就是在 Component 构造器中定义的数据 data 。 此时还不能调用 setData 。 通常情况下，这个生命周期只应该用于给组件 this 添加一些自定义属性字段。

在组件完全初始化完毕、进入页面节点树后， attached 生命周期被触发。此时， this.data 已被初始化为组件的当前值。这个生命周期很有用，绝大多数初始化工作可以在这个时机进行。

在组件离开页面节点树后， detached 生命周期被触发。退出一个页面时，如果组件还在页面节点树中，则 detached 会被触发。



### Q:子组件向父组件传值

```
this.triggerEvent('like',{
    behavior:behavior
  },{})
  
<v-like class="like" bind:like="onLike" like="{{likeStatus}}" count="{{likeCount}}" />

onLike: function (event) {
  const behavior = event.detail.behavior
  likeModel.like(behavior, this.data.classic.id,
    this.data.classic.type)
}
```







