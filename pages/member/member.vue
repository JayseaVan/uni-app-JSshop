<template>
	<view>
		<!-- 个人信息展示 -->
		<view class="userProfile bg-white">
			<view v-if="userInfo.avatarUrl">
				<image class="user-bg" :src="userInfo.avatarUrl"></image>
				<view class="userInfo d-flex flex-column ai-center">
					<image class="user-avatar mb-5" :src="userInfo.avatarUrl" mode="widthFix"></image>
					<view class="username text-white">{{userInfo.nickName}}</view>
				</view>
			</view>
			<view v-else>
				<button
				class="mt-4 mx-5" 
				type="warn" 
				plain="true" 
				@click="handleLogin">登录</button>
			</view>
		</view>
		
		<view class="user-content">
			<view class="user-main">
				<!-- 收藏信息 -->
				<view class="user-collection d-flex bg-white jc-around">
					<view class="d-flex flex-column ai-center py-2">
						<text class="text-primary">0</text>
						<text>收藏的店铺</text>
					</view>
					<navigator url="/pages/collect/collect" class="d-flex flex-column ai-center py-2">
						<text class="text-primary">{{collectNums}}</text>
						<text>收藏的商品</text>
					</navigator>
					<view class="d-flex flex-column ai-center py-2">
						<text class="text-primary">0</text>
						<text>关注的商品</text>
					</view>
					<view class="d-flex flex-column ai-center py-2">
						<text class="text-primary">0</text>
						<text>我的足迹</text>
					</view>
				</view>
				
				<!-- 我的订单 -->
				<view class="user-orders bg-white mt-3">
					<view class="title py-2 border-bottom px-3">我的订单</view>
					<view class="main d-flex jc-between py-2 px-3">
						<navigator url="/pages/order/order?type=1" class="order-item d-flex flex-column ai-center">
							<uni-icons type="compose" size="50rpx" color="#d43c33"></uni-icons>
							<text class="">全部订单</text>
						</navigator>
						<navigator url="/pages/order/order?type=2" class="order-item d-flex flex-column ai-center">
							<uni-icons type="wallet" size="50rpx" color="#d43c33"></uni-icons>
							<text class="">待付款</text>
						</navigator>
						<navigator url="/pages/order/order?type=3" class="order-item d-flex flex-column ai-center">
							<uni-icons type="location" size="50rpx" color="#d43c33"></uni-icons>
							<text class="">待收货</text>
						</navigator>
						<navigator class="order-item d-flex flex-column ai-center">
							<uni-icons type="undo" size="50rpx" color="#d43c33"></uni-icons>
							<text class="">退款/退货</text>
						</navigator>
					</view>
				</view>
				
				<!-- 地址管理 -->
				<view class="recommend bg-white mt-3 px-3 py-2">收货地址管理</view>
				
				<!-- 关于我们 -->
				<view class="contact-service bg-white mt-3">
					<view class="customer-service border-bottom px-3 py-2 d-flex">
						<text class="flex-1">联系客服</text>
						<text>400-618-4000</text>
					</view>
					<view class="feedback border-bottom px-3 py-2">意见反馈</view>
					<view class="aboutUs border-bottom px-3 py-2">关于我们</view>
				</view>
				
				<!-- 推荐 -->
				<view class="recommend bg-white mt-3 px-3 py-2">把应用推荐给其他人</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				collectNums: 0,
			}
		},
		methods: {
			handleLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync("userInfo");
			// console.log(this.userInfo)
			this.collectNums = uni.getStorageSync("collect").length;
		}
	}
</script>

<style lang="scss">
	@import '../../static/scss/_variable.scss';
	
	.userProfile {
		// background: linear-gradient(map-get($colors, 'primary'), transparent);
		height: 45vh;
		overflow: hidden;
		position: relative;
		.user-bg {
			width: 120%;
			// 高斯模糊
			filter: blur(20rpx);
			
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.userInfo {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			
			.user-avatar {
				border-radius: 50%;
				width: 120rpx;
				height: 120rpx;
			}
		}
	}
	
	.user-content {
		position: relative;
		
		.user-main {
			width: 95%;
			position: absolute;
			top: -60rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}

</style>
