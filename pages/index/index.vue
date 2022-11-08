<template>
	<view class="home">
		<Search></Search>
		<!-- 轮播图 -->
		<swiper 
			class="swiper" 
			circular 
			:autoplay="true" 
			:interval="3000" 
			:duration="1000" 
			indicator-dots="true">
			<swiper-item v-for="img in swipers" :key="img.goods_id">
				<image @click="navGoodsDetail(img.goods_id)" :src="img.image_src"></image>
			</swiper-item>
		</swiper>
		
		<!-- 导航区 -->
		<view class="nav d-flex jc-around my-3">
			<view class="nav_item" v-for="(item,index) in navs" :key="index" @click="navItemClick(item.path)">
				<i :class="item.icon"></i>
				<text>{{item.title}}</text>
			</view>
		</view>
		
		<!-- 推荐商品 -->
		<view class="hot-goods">
			
			<!-- <view class="title bg-white fs-xl py-3 m-1 text-center text-primary">推荐商品</view> -->
			<!-- https://blog.csdn.net/duan_mu_lian_jin/article/details/119887080 -->
			<div class="good-cat mx-2" v-for="cat in hotgoods" :key="cat.floor_title">
				<div class="cat-title py-2 my-2">
					<image :src="cat.floor_title.image_src" mode="widthFix"></image>
				</div>
				<div class="goods-list">
					<div class="goods-item bg-white m-1" v-for="(item,index) in cat.product_list" :key="item.name">
						<image 
						class="goods-img w-100 h-100" 
						:src="item.image_src" 
						:mode="index === 0 ? 'widthFix' : 'scaleToFill'" 
						@click="() => navGoodsCat(item.navigator_url)"
						></image>
						<!-- <view class="name m-2 fs-xl">{{item.name}}</view> -->
					</div>
				</div>
			</div>
			
			<!-- <div class="goods-list d-flex flex-wrap jc-between m-2">
				<div class="goods-item m-1 bg-white" v-for="item in 10" :key="index">
					<image class="w-100" src="https://api-hmugo-web.itheima.net/pyg/pic_floor01_1@2x.png" mode="widthFix"></image>
					<view class="price mt-2">
						<text class="text-primary mx-2 fs-xxl">￥2199</text>
						<text class="text-tx-grey" style="text-decoration: line-through;">￥2499</text>
					</view>
					<view class="name m-2 fs-xl">优质服饰</view>
				</div>
			</div> -->
		</view>
		
	</view>
</template>

<script>
	import Search from '../../components/Search.vue';
	
	export default {
		components:{ Search },
		data() {
			return {
				swipers: [],
				hotgoods: [],
				navs: [
					{
						icon: 'iconfont icon-ziyuan',
						title: '分类',
						path: '/pages/category/category'
					},
					{
						icon: 'iconfont icon-guanyuwomen',
						title: '联系我们',
						path: '/pages/contact/contact'
					},
					{
						icon: 'iconfont icon-tupian',
						title: '社区图片',
						path: '/pages/pics/pics'
					},
					{
						icon: 'iconfont icon-shipin',
						title: '学习视频',
						path: '/pages/videos/videos'
					}
				]
			}
		},
		onLoad() {
			this.getSwipers();
			this.getHotGoods();
		},
		methods: {
			// 获取轮播图数据
			async getSwipers() {
				const res = await this.$http({
					url: '/home/swiperdata'
				})
				console.log(res)
				this.swipers = res.data.message
			},
			
			// 获取热门商品数据
			async getHotGoods() {
				const res = await this.$http({
					url: '/home/floordata'
				})
				console.log(res);
				this.hotgoods = res.data.message
			},
			
			// 导航点击跳转函数
			navItemClick(url) {
				uni.switchTab({
					url
				})
			},
			navGoodsDetail(id) {
				uni.navigateTo({
					url: '/pages/goods-detail/goods-detail?goods_id='+id
				})
			},
			navGoodsCat(url) {
				// console.log(url);
				const index = url.indexOf("query=");
				const query = url.slice(index);
				console.log(query);
				uni.navigateTo({
					url: '/pages/goods/goods?' + query
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.home{
		swiper{
			width: 750rpx;
			height: 380rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.nav {
			.nav_item {
				display: flex;
				flex-direction: column;
				text-align: center;
				justify-content: center;
				i {
					width: 100rpx;
					height: 100rpx;
					background-color: map-get($colors, 'primary');
					border-radius: 50%;
					line-height: 100rpx;
					color:  map-get($colors, 'grey');
					font-size: 45rpx;
					margin-bottom: 14rpx;
				}
			}
		}
		
		.hot-goods {
			.title {
				font-size: 34rpx;
				letter-spacing: 20px;
				border-radius: 10px;
			}
			.goods-list {
				overflow: hidden; // 父元素清除浮动
				.goods-item {
					border-radius: 10px;
					overflow: hidden;
					
					width: 31%;
					float: left;
					&:not(:first-child) {
						height: 232.5rpx * 386 / 232 / 2;
					}
				}
			}
			.cat-title {
				// background: linear-gradient(rgba(254, 98, 18, .2), rgba(218, 13, 0, .5));
				background: white;
				display: flex;
				justify-content: center;
				border-radius: 10px;
				// clear: left;
			}
		}
	}
</style>
