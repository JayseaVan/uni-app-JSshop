<template>
	<view class="collect">
		<Tabs :tabTitle="tabTitle">
			<!-- 标签 -->
			<view class="tags bg-grey p-3 border-bottom">
				<text class="active bg-white py-2 px-3 mr-2">全部</text>
				<text class="bg-white p-2 mr-2">正在热卖</text>
				<text class="bg-white p-2 mr-2">即将上线</text>
			</view>
			
			<!-- 商品 -->
			<view class="goods-list">
				<view
				class="goods-item d-flex pl-3 py-2 border-bottom"
				v-for="item in collectGoods" 
				:key="item.goods_id"
				@click="navGoodsDetail(item.goods_id)">
					<image :src="item.goods_small_logo ? item.goods_small_logo : 'https://ts1.cn.mm.bing.net/th/id/R-C.95648a2520cd9df8eaa99bd8dfa7d495?rik=pomuzrtnEHhDoQ&riu=http%3a%2f%2fwww.sucaijishi.com%2fuploadfile%2f2017%2f0510%2f20170510104938760.gif&ehk=vAgstSifAKbIlyvKkMb7qIksnpDG0bFrpBXmPwwDVJw%3d&risl=&pid=ImgRaw&r=0'" mode=""></image>
					<view class="d-flex flex-column m-3 jc-around">
						<view class="name">{{item.goods_name}}</view>
						<view class="price fs-xxl text-primary">￥{{item.goods_price}}</view>
					</view>
				</view>
			</view>
		</Tabs>
	</view>
</template>

<script>
	import Tabs from '../../components/Tabs.vue';
	
	export default {
		data() {
			return {
				tabTitle: ['商品收藏', '品牌收藏', '店铺收藏', '浏览足迹'],
				collectGoods: [],
			}
		},
		components: { Tabs },
		methods: {
			// 导航至商品详情页面
			navGoodsDetail(id) {
				uni.navigateTo({
					url:'/pages/goods-detail/goods-detail?goods_id='+id
				})
			}
		},
		onShow() {
			this.collectGoods = uni.getStorageSync("collect") || [];
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.collect {
		.tags {
			text {
				border: 1px solid map-get($colors, 'border-grey');
				&.active {
					color: map-get($colors, 'primary');
					border-color: map-get($colors, 'primary');
				}
			}
		}
		
		.goods-list {
			.goods-item {
				image {
					max-width: 200rpx;
					max-height: 200rpx;
				}
			}
		}
	}
</style>
