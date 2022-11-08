<template>
	<view class="tabs">
		<view class="tabs-title d-flex bg-white jc-around">
			<view 
			class="title-item py-3 fs-xl flex-1 text-center" 
			:class="currentIndex === index ? 'active' : ''" 
			v-for="(item, index) in tabTitle" 
			:key="index" 
			@click="clickNav(index)">
				{{item}}
			</view>
		</view>
		<!-- {{tabIndex}}
		{{currentIndex}} -->
		<view class="tabs-content bg-white">
			<slot :currentIndex="currentIndex"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name:"Tab",
		data() {
			return {
				currentIndex: this.tabIndex,
			};
		},
		props:{
			tabTitle: {
				type: Array,
				required: true
			},
			// 根据传入的 tabIndex 值来决定最初渲染页面时，Tabs中被激活的标题
			tabIndex: {
				type: Number,
				required: false,
				default: 0
			}
		},
		// (Vue之props赋值给data 数据变化)https://blog.csdn.net/weixin_42307283/article/details/116792057
		watch: {
			tabIndex() {
				this.currentIndex = this.tabIndex;
			}
		},
		methods: {
			clickNav(index) {
				this.currentIndex = index;
				// console.log(this.currentIndex)
				this.$emit('sendIndex', index);
			}
		},
		onLoad() {
			console.log(this.tabTitle)
		}
	}
</script>

<style lang="scss">
	@import '../static/scss/_variable.scss';
	
	.tabs-title {
		.active {
			color: map-get($colors, 'primary');
			border-bottom: 3px solid map-get($colors, 'primary');
		}
	}
</style>