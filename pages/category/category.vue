<template>
	<view class="category bg-white">
		<scroll-view class="cat-nav fs-xl bg-grey text-center" scroll-y="true">
			<view
			class="cat-nav-item"
			:class="index === currentIndex ? 'active' : ''"
			v-for="(cat,index) in leftMenuList"
			:key="index"
			@click="clickNav(index)"
			>{{cat}}</view>
		</scroll-view>
		
		<scroll-view class="cat-show mb-3" scroll-y="true" :scroll-top="scrollTop" @scroll="scroll">
			<view class="cat-goods" v-for="cat in rightGoodsItems" :key="cat.cat_id">
				<view class="cat-goods-title fs-xl font-bold m-2 mt-4">{{cat.cat_name}}</view>
				<view class="cat-goods-list d-flex flex-wrap">
					<view
					class="cat-goods-item d-flex flex-column ai-center"
					v-for="item in cat.children"
					:key="item.cat_id"
					@click="navGoods(item.cat_id)">
						<image class="picture w-100" :src="item.cat_icon" mode="widthFix"></image>
						<view class="name my-1">{{item.cat_name}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: [],
				leftMenuList: [],
				rightGoodsItems: [],
				currentIndex: 0,
				
				// 右侧商品内容滚动条与顶部的距离
				// 如果遇到scroll-top、scroll-left、refresher-triggered属性设置不生效的问题参考：组件属性设置不生效解决办法
				// https://uniapp.dcloud.net.cn/tutorial/vue-api#componentsolutions
				scrollTop: 0,
				old: {
					scrollTop: 0
				}
			}
		},
		methods: {
			async getcategories() {
				const res = await this.$http({
					url: '/categories'
				})
				this.categories = res.data.message;
				
				// 把接口的数据存储到本地存储中
				uni.setStorageSync("cates", {time: Date.now(), data: this.categories});
				
				this.leftMenuList = this.categories.map(v => v.cat_name);
				this.rightGoodsItems = this.categories[0].children;
				// console.log(this.leftMenuList);
				// console.log(this.rightGoodsItems);
			},
			scroll(e){
				this.old.scrollTop = e.detail.scrollTop
			},
			
			// 点击导航条：1.切换导航激活样式；2.动态切换右侧商品列表
			clickNav(index) {
				this.currentIndex = index;
				this.rightGoodsItems = this.categories[index].children;
				
				// 重新设置右侧商品内容滚动条与顶部的距离为0
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			
			// 导航点击跳转至商品列表页面
			navGoods(cid) {
				uni.navigateTo({
					url: '/pages/goods/goods?cid='+cid
				})
			}
		},
		onLoad() {
			
			/* 本地存储
			 * 1. 先判断本地存储中有无旧数据 {time: Date.now(), data: [...]}
			 * 2. 如果没有旧数据，直接发送新请求
			 * 3. 有旧的数据
			 * 		3.1 判断旧数据是否过期？
			 * 		过期： 发送新请求
			 * 		没过期：使用本地存储的旧数据
			 * */
			 
			 // 1. 获取本地存储中的数据
			 const localCates = uni.getStorageSync("cates");
			 // 2. 判断
			 if (!localCates) {
				 this.getcategories();
			 } else {
				 if (Date.now() - localCates.time > 1000 * 60 * 10) {
					 this.getcategories();
				 } else {
					 this.categories = localCates.data;
					 this.leftMenuList = this.categories.map(v => v.cat_name);
					 this.rightGoodsItems = this.categories[0].children;
					 this.scrollTop = 0;
				 }
			 }
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.category {
		display: flex;
		height: 100vh;
		.cat-nav {
			width: 170rpx;
			
			.cat-nav-item {
				height: 92rpx;
				line-height: 92rpx;
				border-right: 2px solid map-get($colors, 'grey');
			}
			.active {
				background: #fff;
				color: map-get($colors, 'primary');
			}
		}
		
		.cat-show {
			width: 580rpx;
			.cat-goods {
				.cat-goods-item {
					width: 33.33%;
					text-align: center;
					image {
						width: 65%;
					}
				}
			}
		}
	}
</style>
