<template>
	<view class="shopping-cart">
		<!-- 收获地址 -->
		<view class="shopping-address text-center bg-white py-2">
			<button v-if="!address.userName" @click="fetchAddress" size="mini" type="warn" plain="true">添加收获地址</button>
			<view v-else class="addressInfo py-2 px-3">
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
			<view v-if="shoppingInfo.length">
				<view
				class="shopping-list bg-white d-flex ai-center px-3 py-1"
				v-for="item in shoppingInfo"
				:key="item.goods_id"
				>
					<checkbox :checked="item.checked" @click="changeChecked(item.goods_id)"/>
					<image class="mx-2" :src="item.goods_small_logo" mode="widthFix"></image>
					<view class="d-flex flex-column p-2">
						<text>{{item.goods_name}}</text>
						<view class="d-flex jc-between mt-2 ai-center">
							<view class="price text-primary fs-xxl">￥{{item.goods_price}}</view>
							<view class="d-flex ai-center">
								<button size="mini" @click="handleNumEdit(item.goods_id, -1)">-</button>
								<text class="mx-2">{{item.num}}</text>
								<button size="mini" @click="handleNumEdit(item.goods_id, 1)">+</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-else class="noItems d-flex flex-column ai-center mt-3">
				<image src="../../static/image/27cac498990bf33f7a7c3d0eaefa8b4a.png" mode="widthFix"></image>
				<text class="my-3">购物车空空如也~</text>
				<button @click="navGoodsList" size="mini" type="warn" plain="true">去逛逛</button>
			</view>
		</view>
		
		<!-- 底部商品结算 -->
		<view class="cart-compute d-flex ai-center bg-white">
			<view class="flex-1 d-flex ai-center px-2">
				<view class="flex-1">
					<checkbox :checked="allChecked" @click="handleAllChecked"/><text>全选</text>
				</view>
				<view class="d-flex flex-column text-right">
					<view>
						<text>合计：</text>
						<text class="price text-primary fs-xxl">￥{{totalPrice}}</text>
					</view>
					<text>包含运费</text>
				</view>
			</view>
			<view @click="handlePay" class="compute-confirm bg-primary text-white fs-xxl px-3 h-100">结算({{totalNum}})</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: {},
				shoppingInfo: [],
				allChecked: false,
				totalPrice: 0,
				totalNum: 0
			}
		},
		methods: {
			// 获取收货地址
			fetchAddress() {
				// 1. 获取权限状态
				uni.getSetting({
					success: (res) => {
						const scopeAddress = res.authSetting["scope.address"];
						// 2. 用户点击‘确认’或从未点击的权限状态
						if (scopeAddress === true || scopeAddress === 'undefined') {
							// 获取用户的收货地址
							uni.chooseAddress({
								success: (result1) => {
									uni.setStorageSync("address", result1);
									this.address = result1;
								}
							})
						} else {
							// 3. 用户点击‘取消’的权限状态——诱导用户打开权限管理界面
							uni.openSetting({
								success: (result2) => {
									// 获取用户的收货地址
									uni.chooseAddress({
										success: (result3) => {
											uni.setStorageSync("address", result3);
											this.address = result3;
										}
									})
								}
							})
						}
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			
			// 改变商品选中状态
			changeChecked(id) {
				// 找到被修改的商品对象
				let index = this.shoppingInfo.findIndex(v => v.goods_id === id);
				// 选中状态取反
				this.shoppingInfo[index].checked = !this.shoppingInfo[index].checked;
				// 重新存储回本地存储
				uni.setStorageSync("cart", this.shoppingInfo);
				// 重新计算全选，选中的总价格、总数量
				this.setCart();
			},
			
			// 商品全选功能
			handleAllChecked() {
				// allChecked的值取反
				this.allChecked = !this.allChecked;
				// 循环修改 shoppingInfo 数组中的商品选中状态
				this.shoppingInfo.forEach(v => v.checked = this.allChecked);
				// 重新计算全选，选中的总价格、总数量
				this.setCart();
				// 将修改后的值填重新存储到本地
				uni.setStorageSync("cart", this.shoppingInfo);
			},
			
			// "-"/"+" 按钮的功能实现
			handleNumEdit (id, operation) {
				// 找到需要修改的商品的索引
				const index = this.shoppingInfo.findIndex(v => v.goods_id === id);
				let item = this.shoppingInfo[index];
				// 判断是否要执行删除
				if (item.num === 1 && operation === -1) {
					// 弹窗提示
					uni.showModal({
						title: '提示',
						content: '您是否要删除？',
						success: (res) => {
							if (res.confirm) {
								this.shoppingInfo.splice(index, 1);
								this.setCart();
								uni.setStorageSync("cart", this.shoppingInfo);
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				} else {
					// 修改num
					item.num += operation;
					// 重新计算全选，选中的总价格、总数量
					this.setCart();
					// 将修改后的值填重新存储到本地
					uni.setStorageSync("cart", this.shoppingInfo);
				}
			},
			
			// 设置购物车状态，同时重新计算底部工具栏的数据：全选、选中的总价格、选中的总数量
			setCart() {
				// 计算全选框
				// every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。如果回调函数的每一次返回都为 truthy 值，返回 true，否则返回 false。
				// 注：若收到一个空数组，此方法在任何情况下都会返回 true。
				// 此处用了every()循环数组，下面又用了forEach()遍历数组，遍历两次浪费性能，所以可以优化代码
				// this.allChecked = this.shoppingInfo.length ? this.shoppingInfo.every(v => v.checked) : false;
				
				// 判断数组是否为空
				this.allChecked = this.shoppingInfo.length !== 0 ? true : false;
				
				// 计算选中的总价格、总数量
				this.totalPrice = 0;
				this.totalNum = 0;
				this.shoppingInfo.forEach(v => {
					if (v.checked) {
						this.totalPrice += v.num * v.goods_price;
						this.totalNum += v.num;
					} else {
						this.allChecked = false;
					}
				})
			},
			
			// 点击结算
			handlePay() {
				// 1. 判断收货地址
				if (!this.address.userName) {
					uni.showToast({
						title: '您还没有添加收获地址',
						icon: 'none'
					});
					return;
				}
				// 2. 判断用户有没用选购商品
				if (this.totalNum === 0) {
					uni.showToast({
						title: '您还没有选购商品',
						icon: 'none'
					});
					return;
				}
				// 3. 跳转至支付页面
				uni.navigateTo({
					url: '/pages/pay/pay'
				});
			},
			
			// 跳转至商品分类页面
			navGoodsList() {
				uni.switchTab({
					url: '/pages/category/category'
				})
			}
		},
		onShow() {
			this.address = uni.getStorageSync("address");
			this.shoppingInfo = uni.getStorageSync("cart") || [];
			
			this.setCart();
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
		
		.noItems {
			image {
				width: 60%;
			}
		}
		
		.cart-compute {
			.compute-confirm {
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
