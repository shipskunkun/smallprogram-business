## review2

20200703


| 7个page  | 12个组件 |
|  ----  | ----  |
| classic | 首页，第一个tabBar |
| book  | 第二个tabBar |
| my | 第三个tabBar |
| classic-detail | 点击 v-preview 进入 |
| book-detail | book-detail页, 点击book进入 |
| about  | 关于页面，点击进入别的小程序 |
| course | 展示图片页面  |
| 组件： |  —————————— |
| classic | 首页，essay、movie、music 组件 |
| episode | 首页日历组件|
| image-button | 首页button组件 |
| like | 首页点赞组件 |
| navi | 首页前进后退组件|
| book | book页面，单个课本组件 |
| search | book页面，搜索书籍组件|
| behaviors | book页面使用的behavior  |
| mask| book-detail页，输入短评的时候，会出现遮罩效果 |
| tag | book-detail页， 短评组件 |
| preview | my 页面组件，点击进入classic-detail |
| loading | 加动画效果的loading |
	
	

## 1.一般的



#### 1.1 组件代码复用


	1. 代码中， essay、movie、music 共享一个 behaviors.js  
	2. 每个页面都有加载逻辑
	3. 三个tab页面都有获取 getUserinfo, checkin


behaviors 是用于组件间代码共享的特性，类似于一些编程语言中的“mixins”或“traits”。
组件和它引用的 behavior 中可以包含同名的字段，对这些字段的处理方法如下：

1. 如果有同名的属性或方法，组件本身的属性或方法会覆盖 behavior 中的属性或方法，如果引用了多个 behavior ，在定义段中靠后 behavior 中的属性或方法会覆盖靠前的属性或方法；  
如果有同名的数据字段，如果数据是对象类型，会进行对象合并，如果是非对象类型则会进行相互覆盖；

2. 生命周期函数不会相互覆盖，而是在对应触发时机被逐个调用。如果同一个 behavior 被一个组件多次引用，它定义的生命周期函数只会被执行一次。


#### 1.2 缓存

注意缓存，缓存是不会因为小程序重新启动， 重新编辑 就清空，在开发环境中，需要我们手动清除缓存

需要注意，是否错误是由于缓存导致的

> 如何前进后退，使用历史数据，而不是每次想服务器发送请求？

每次请求期刊，使用缓存存储，下次获取，先判断缓存中是否有，没有，再重新请求数据
这样，向左，向右，就不会每次像服务器发送请求了



 问题：当我们来回切换 navi 时候，由于缓存的存在，我们没有重新向服务器发送请求，但是不同项的，喜欢、不喜欢、喜欢数目是不同的，这个需要向服务器实时获取，更新
 
 哪些数据是可以被缓存的？
 	
 	期刊数据
 哪些不应该被缓存？
 	
 	点赞状态，点赞数据，应该是实时获取，更新



#### 1.3 公共样式

classic 几个组件，essay、movie、music 样式公用，抽取到一个样式文件中，然后在每个组件的 wxss 文件中引入公共样式即可，

```
@import '../common.wxss'  
```

#### 1.4 历史搜索记录  


1. 出现的场景：
	
		搜索书籍时候，存储历史搜索记录

2. 历史记录是本地缓存，热门搜索是实时请求数据
	
		长度不超过10个

3. 使用了组件，

		v-tag
	
	
	
> 思考：存储数据结构，存储容量，使用缓存，判断重复
	
	我们这里使用队列，存储历史搜索记录，先进先出，按照搜索时间倒序排列，最新搜索的排在第一位

1. 添加一个记录的逻辑？
	
		原来存不存在 list 中？
			存在？
				删除原来的位置，在头部加
			不存在？
				直接在头部插入
				
		插入后长度变化
			>10, 删除最后一个
			
2. 	获取历史记录数组
	
		const words = wx.getStorageSync('q')
		
	
### 1.5 下拉组件刷新

这里的逻辑如下：v-search 中监听变量 more, 只要和上一次不一样，向后端请求数据

	<v-search more="{{more}}" bind:cancel="onCancel" wx:if="{{searching}}" />
	
	properties: {
	    more: {
	      type: String,
	      observer: 'loadMore'
	      // true, true, true,
	    }
	  },

如果不改变more 值，不会每次触底，执行请求


## 2.其他代码层面的


#### 2.1 子组件接受父组件

接受数据，使用 properties. 

+ 对付组件传过来的值，做处理，使用 observer
+ 使用observer的注意点，不能在 observer，setData 原来的数据，会导致递

#### 2.2 缓存

#### 2.3 公共方法 utils

1. 截取方法，短评的长度，过长不显示


		var limit = function(array, length){
		    return array.slice(0, length)
		}


2. 高亮评论
	
		不同种类的短评，背景色不同，class 不同
		根据data 的 hightlight 过滤器，返回对应的 class
	

#### 2.4 翻页 pagination 

> loadMore 逻辑
	
	1. 如果搜索条件为空，返回
	2. 如果被锁住了，返回
	3. 如果还有数据
	
	锁住，拼接请求结果，显示，解锁	

> pagination 组件

1. 把上次的搜索结果 和 这次的拼接

		setMoreData
		
		this.data.dataArray.concat(dataArray)
2. 判断是否还有数据

		当前数据总长度 < 后端返回的 total
3. 是否还可以请求数据？
		
		收到返回结果之前，拼接数据之前，loading 结束之前，不能获取
		this.data.loading ? true : false
		
4. 复原

		initialize，状态复原
		
#### 2.5 组件发送请求

onReachBottom， 想让组件发送请求怎么做？
	
	向组件发一个 16位随机码， observer， 更新了就发请求
	
	properties: {
	    more: {
	      type: String,
	      observer: 'loadMore'
	      // true, true, true,
	    }
	 }

#### 2.6 两种tag

一种，历史记录页使用的tag	
一种，后面有点赞数,book-detail 页面使用的

```
<view bind:tap="onTap" class="container tag-class ">
    <slot name="before"></slot>
    <text >{{text}}</text>
    <slot name="after"></slot>
</view>

```
	

#### 2.7 navi

1. 组成
	
		向左翻页，是否是最早一张，行为？return， 表现？置灰
		向右翻页，是否是最后一张，行为？return， 表现？置灰
2. 	触发
	
		this.triggerEvent('left', {}, {})
3. navi 中使用缓存

	
		上一个，下一个，看看 id 是否在 本地存储中，
		有，直接从本地存储拿
		没有，再请求，再存入本地存储
		
		 let classic = wx.getStorageSync(key)
        if (!classic) {
            this.request({
                url: `classic/${index}/${nextOrPrevious}`,
                success: (res) => {
                    wx.setStorageSync(
                        this._getKey(res.index), res)
                }
            })
        }
		