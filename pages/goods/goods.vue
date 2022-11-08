<template>
	<view>
		<Search></Search>

		<Tabs :tabTitle="tabTitle" v-slot="{currentIndex}">
			<!-- {{currentIndex}} -->
			<view class="first-tab" v-if="currentIndex === 0">
				<view 
				class="goods-item d-flex px-3 py-2"
				v-for="item in goodsList" 
				:key="item.goods_id"
				@click="navGoodsDetail(item.goods_id)">
					<image :src="item.goods_small_logo ? item.goods_small_logo : 'https://ts1.cn.mm.bing.net/th/id/R-C.95648a2520cd9df8eaa99bd8dfa7d495?rik=pomuzrtnEHhDoQ&riu=http%3a%2f%2fwww.sucaijishi.com%2fuploadfile%2f2017%2f0510%2f20170510104938760.gif&ehk=vAgstSifAKbIlyvKkMb7qIksnpDG0bFrpBXmPwwDVJw%3d&risl=&pid=ImgRaw&r=0'" mode=""></image>
					<view class="d-flex flex-column m-3 jc-around">
						<view class="name">{{item.goods_name}}</view>
						<view class="price fs-xxl text-primary">￥{{item.goods_price}}</view>
					</view>
				</view>
			</view>
			
			<view class="second-tab" v-if="currentIndex === 1">1</view>
			<view class="third-tab" v-if="currentIndex === 2">2</view>
		</Tabs>
	</view>
</template>

<script>
	import Tabs from '../../components/Tabs.vue';
	import Search from '../../components/Search.vue';
	
	export default {
		data() {
			return {
				tabTitle:['综合', '销量', '价格'],
				// 接口要的参数
				queryParams: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				// 渲染商品列表
				goodsList: [],
				// 总页数
				totalPages: 1
			}
		},
		components:{ Tabs, Search },
		methods: {
			async getGoodsList(callback) {
				const res = await this.$http({
					url: '/goods/search',
					data: this.queryParams
				})
				// console.log(res);
				// 拼接原数组数据与请求回来的数据
				this.goodsList = [...this.goodsList, ...res.data.message.goods];
				// 获取总条数
				let total = res.data.message.total;
				// 计算总页数
				this.totalPages = Math.ceil(total / this.queryParams.pagesize);
				// 当有传递回调函数(停止下拉刷新加载动画的回调)时,才调用,否则不执行
				callback && callback();
			},
			
			// 导航至商品详情页面
			navGoodsDetail(id) {
				uni.navigateTo({
					url:'/pages/goods-detail/goods-detail?goods_id='+id
				})
			}
		},
		onLoad(options) {
			console.log(options);
			this.queryParams.cid = options.cid || '';
			this.queryParams.query = options.query || '';
			
			this.getGoodsList();
		},
		// 上拉加载
		onReachBottom() { // onReachBottom 页面生周期——页面滚动到底部的事件
			if (this.queryParams.pagenum < this.totalPages) {
				// console.log('有下一页数据')
				this.queryParams.pagenum++;
				this.getGoodsList();
			} else {
				// console.log('没有下一页数据')
				uni.showToast({
					title: '没有下一页数据了'
				})
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 1.重置数组
			this.goodsList = [];
			// 2.重置页码为1
			this.queryParams.pagenum = 1;
			// 3.重新发送请求
			this.getGoodsList(() => {
				// 4.数据回来后,手动关闭刷新等待效果
				uni.stopPullDownRefresh();
			})
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.goods-item {
		border-bottom: 1px solid map-get($colors, 'border-grey');
		image {
			max-width: 240rpx;
			max-height: 240rpx;
		}
	}
</style>
