<template>
	<view class="goods-detail">
		<swiper class="swiper bg-white" :indicator-dots="true" circular >
			<swiper-item 
			class="swiper-item d-flex ai-center" 
			v-for="(pic,index) in goodsObj.pics" 
			:key="pic.pics_id"
			@click="handlePreviewImage(index)">
				<image class="w-100" :src="pic.pics_mid_url"></image>
			</swiper-item>
		</swiper>
		
		<view class="goods-price text-primary fs-xxl bg-white px-2">￥{{goodsObj.goods_price}}</view>
		<view class="goods-title d-flex bg-white py-2 px-3">
			<view class="goods-name">{{goodsObj.goods_name}}</view>
			<view @click="handleCollect" class="goods-collect d-flex flex-column ai-center">
				<uni-icons v-if="isCollect === false" type="star"></uni-icons>
				<uni-icons v-else type="star-filled" color="#ffa200"></uni-icons>
				<text>收藏</text>
			</view>
		</view>
		
		<view class="description bg-white">
			<view class="title py-3 px-4 mt-2 fs-xl font-bold border-bottom">图文详情</view>
			<!-- 富文本 -->
			<rich-text :nodes="goodsObj.goods_introduce"></rich-text>
		</view>
		
		<!-- 商品导航 -->
		<view class="fixedBottom">
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsObj: [],
				isCollect: false,
				goodsPics_urls: [],
				// 商品导航配置数据
				options: [
					{
						icon: 'headphones',
						text: '客服'
					}, 
					{
						icon: 'paperplane',
						text: '分享',
					}, 
					{
						icon: 'cart',
						text: '购物车',
						info: 0
					},
				],
				buttonGroup: [
					{
						text: '加入购物车',
						backgroundColor: '#ffa200',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ff0000',
						color: '#fff'
					}
				]
			}
		},
		methods: {
			// 1. 发送请求获取数据
			async getGoodsDetail(goods_id) {
				const res = await this.$http({
					url: '/goods/detail',
					data: {goods_id}
				})
				console.log(res);
				this.goodsObj = res.data.message;
				this.goodsPics_urls = res.data.message.pics.map(v => v.pics_big_url);
				/* 商品收藏 */
				// 1. 获取缓存中的商品收藏数组
				let collect = uni.getStorageSync("collect") || [];
				// 2. 判断当前商品是否被收藏
				this.isCollect = collect.some(v => v.goods_id === this.goodsObj.goods_id);
			},
			
			// 2. 点击轮播图,图片放大预览
			handlePreviewImage(index) {
				uni.previewImage({
					current: this.goodsPics_urls[index],
					urls: this.goodsPics_urls
				})
			},
			
			// 3. 商品导航(购物车)点击方法
			onClick (e) {
				// uni.showToast({
				// 	title: `点击${e.content.text}`,
				// 	icon: 'none'
				// });
				console.log(e.index)
				
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick (e) {
				console.log(e)
				
				if (e.index === 0) {
					/* 点击加入购物车 */
					// 1. 获取缓存中的购物车数组
					let cart = uni.getStorageSync("cart") || [];
					// 2. 判断商品对象是否存在于购物车中
					// Js语法: findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。
					let index = cart.findIndex(v => v.goods_id === this.goodsObj.goods_id);
					if (index === -1) {
						// 3.1 不存在, 第一次添加
						this.goodsObj.checked = true;
						this.goodsObj.num = 1;
						cart.push(this.goodsObj);
					} else {
						// 3.2 已经存在购物车数据, 执行 num++ ;
						cart[index].num++;
					}
					// 4. 把购物车重新添加到缓存中
					uni.setStorageSync("cart", cart);
					// 5. 弹窗提示
					uni.showToast({
						title: '添加成功',
						icon: 'success',
						mask: true // 防止用户手抖,疯狂点击按钮 
					})
					
					// 购物车总数量
					let nums = cart.map(v => v.num);
					this.options[2].info = nums.reduce((a, b) => a + b, 0);
				}
			},
			
			// 4. 点击商品收藏按钮
			// 4.1 判断该商品是否存在于缓存数组中
			// 		1. 存在：把该商品从缓存数组中删除
			// 		2. 不存在：把该商品添加到收藏的缓存数组中
			handleCollect() {
				// 1. 获取缓存中的商品收藏数组
				let collect = uni.getStorageSync("collect") || [];
				// 2. 判断该商品是否被收藏过
				let index = collect.findIndex(v => v.goods_id === this.goodsObj.goods_id);
				// 3. 当 index !== -1 时表示已经收藏过
				if (index !== -1) {
					collect.splice(index, 1);
					uni.showToast({
						title: '取消收藏',
						icon: 'success',
						mask: true
					});
				} else {
					collect.push(this.goodsObj);
					uni.showToast({
						title: '收藏成功',
						icon: 'success',
						mask: true
					})
				}
				// 4. 把数组存回缓存中
				uni.setStorageSync("collect", collect);
				// 5. 修改 data 中 isCollect 的值
				this.isCollect = !this.isCollect;
			}
		},
		onShow() {
			// 获取页面url的参数
			let pages = getCurrentPages();
			let currentPage = pages[pages.length - 1];
			let options = currentPage.options;
			const {goods_id} = options;
			console.log(goods_id);
			// 调用发送请求数据的getGoodsDetail方法
			this.getGoodsDetail(goods_id);
			
			// 计算本地存储cart中num的总数，赋值给商品导航中购物车的info属性
			let cart = uni.getStorageSync("cart") || [];
			let nums = cart.map(v => v.num);
			this.options[2].info = nums.reduce((a, b) => a + b, 0);
			
			
		},
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.goods-detail {
		.swiper {
			width: 750rpx;
			height: 650rpx;
		}
		.goods-title {
			border-bottom-left-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			.goods-name {
				flex: 5;
				// 只显示两行文本,如果超出则用...表示
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.goods-collect {
				// width: 100rpx;
				flex: 1;
				border-left: 1px solid map-get($colors, 'border-grey');
			}
		}
		.description {
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
		}
		// 购物栏置底 - uni-ui组件uni-goods-nav放在屏幕下方的办法
		// https://blog.csdn.net/qq285744011/article/details/122414132
		.fixedBottom {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>
