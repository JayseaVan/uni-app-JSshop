<template>
	<view class="shopping-cart">
		<!-- 收获地址 -->
		<view class="shopping-address text-center bg-white py-2">
			<view class="addressInfo py-2 px-3">
				<view class="d-flex jc-between">
					<text>收货人：{{address.userName}}</text>
					<text>电话：{{address.telNumber}}</text>
				</view>
				<view class="text-left">地址：{{address.provinceName}}-{{address.cityName}}-{{address.countyName}}-{{address.detailInfo}}</view>
			</view>
		</view>
		
		<view class="title fs-xxl bg-white p-3 my-2">购物车</view>
		<!-- 购物车内容 -->
		<view class="cart-content">
			<view
			class="shopping-list bg-white d-flex ai-center px-3 py-1"
			v-for="item in shoppingInfo"
			:key="item.goods_id"
			>
				<image class="mx-2" :src="item.goods_small_logo" mode="widthFix"></image>
				<view class="d-flex flex-column p-2">
					<text>{{item.goods_name}}</text>
					<view class="d-flex jc-between mt-2 ai-center">
						<view class="price text-primary fs-xxl">￥{{item.goods_price}}</view>
						<view class="d-flex ai-center">
							<text class="mx-2">X {{item.num}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 底部商品结算 -->
		<view class="cart-compute d-flex ai-center bg-white">
			<view class="flex-1 px-2">
				<view class="d-flex flex-column text-right">
					<view>
						<text>合计：</text>
						<text class="price text-primary fs-xxl">￥{{totalPrice}}</text>
					</view>
					<text>包含运费</text>
				</view>
			</view>
			<view class="pay-confirm bg-primary text-white fs-xxl px-3 h-100">支付({{totalNum}})</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: {},
				shoppingInfo: [],
				totalPrice: 0,
				totalNum: 0
			}
		},
		methods: {
			
		},
		onLoad() {
			this.address = uni.getStorageSync("address");
			this.shoppingInfo = uni.getStorageSync("cart") || [];
			
			// 过滤选中的商品 (checked = true)
			this.shoppingInfo = this.shoppingInfo.filter(v => v.checked);
			
			// 计算选中的总价格、总数量
			this.totalPrice = 0;
			this.totalNum = 0;
			this.shoppingInfo.forEach(v => {
				this.totalPrice += v.num * v.goods_price;
				this.totalNum += v.num;
			})
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	page {
		padding-bottom: 90rpx;
	}
	
	.shopping-cart {
		.shopping-list {
			border-bottom: 1px solid map-get($colors, 'border-grey');
			image {
				max-width: 180rpx;
				max-height: 180rpx;
			}
		}
		
		.cart-compute {
			.pay-confirm {
				line-height: 90rpx;
			}
			border-top: 1px solid map-get($colors, 'border-grey');
			width: 100%;
			height: 90rpx;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>
