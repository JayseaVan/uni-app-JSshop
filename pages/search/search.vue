<template>
	<view>
		<uni-search-bar :focus="true" v-model="searchValue" 
			@input="input" 
			bgColor="white" placeholder="请输入您要搜索的商品">
		</uni-search-bar>
		
		<view class="search-content bg-white mx-3">
			<view 
			class="search-item px-3 py-2 border-bottom"
			v-for="item in goods"
			:key="item.goods_id">
				<text @click="navGoodsDetail(item.goods_id)" class="w-100 text-ellipsis">{{item.goods_name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: [],
				timeID: -1, // 定时器
			}
		},
		methods: {
			// 发送请求获取数据
			async fetchData(query) {
				const res = await this.$http({
					url: '/goods/search',
					data: { query }
				});
				this.goods = res.data.message.goods;
			},
			
			input(val) {
				// 如果输入的值为空，则清空商品显示列表
				if (!val.trim()) {
					this.goods = [];
					return;
				}
				
				/* 防抖的实现——优化性能 */
				clearTimeout(this.timeID);
				this.timeID = setTimeout(() => {
					// 调用函数发送请求获取数据
					this.fetchData(val);
				}, 1000);
			},
			
			navGoodsDetail(id) {
				uni.navigateTo({
					url: '/pages/goods-detail/goods-detail?goods_id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #8b8b8b;
	}
	.search-content {
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
	}
</style>
