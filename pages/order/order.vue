<template>
	<view>
		<Tabs :tabTitle="tabTitle" :tabIndex="tabIndex" @sendIndex="handleIndex">
			<view class="order-list border-top">
				<view class="order-item border-bottom p-3" 
				v-for="item in orders" 
				:key="item.user_id">
					<view class="d-flex jc-between">
						<text>订单编号</text>
						<text>{{item.order_number}}</text>
					</view>
					<view class="d-flex py-2 jc-between">
						<text>订单价格</text>
						<text class="text-primary fs-xxl">￥{{item.order_price}}</text>
					</view>
					<view class="d-flex jc-between">
						<text>订单日期</text>
						<text>{{item.create_time_cn}}</text>
					</view>
				</view>
			</view>
		</Tabs>
	</view>
</template>

<script>
	import Tabs from '../../components/Tabs.vue'
	
	export default {
		data() {
			return {
				tabTitle: ['全部订单', '待付款', '待收货', '退款/退货'],
				tabIndex: 0,
				orders: [],
				header: {},
			}
		},
		components: { Tabs },
		methods: {
			// 获取历史订单数据
			async getOrders(type, header) {
				const res = await this.$http({
					url: '/my/orders/all',
					data: {type},
					header
				});
				this.orders = res.data.message.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString())}));
				console.log(this.orders);
			},
			handleIndex(index) {
				// console.log("xxx", index);
				this.getOrders(index + 1, this.header)
			}
		},
		onShow() {
			// 获取缓存中的token
			const token = uni.getStorageSync("token");
			if (!token) {
				uni.navigateTo({
					url: '/pages/auth/auth'
				});
				return;
			}
			const header = {Authorization: token};
			this.header = header;
			
			// 0. onShow()不同于onLoad()不能直接接收options参数获取当前页面url的参数
			// 0.1 获取当前小程序的页面栈——数组，长度最大是10
			let pages = getCurrentPages();
			// 0.2 数组中 索引最大的页面就是当前的页面
			let currentPage = pages[pages.length - 1];
			
			// 1. 获取url上的参数type
			const { type } = currentPage.options;
			
			// 2. 根据 type 去发送请求获取订单数据
			this.getOrders(type, header);
			
			// 3. 根据 type 值来决定Tabs的标题哪一个被激活选中
			this.tabIndex = type - 1;
		}
	}
</script>

<style>

</style>
