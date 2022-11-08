<template>
	<view class="search-box bg-primary w-100 text-center pt-1 pb-2">
		<navigator 
		url="/pages/search/search" 
		class="search-input bg-white py-2 mx-2" 
		>搜索</navigator>
	</view>
</template>

<script>
	export default {
		name:"Search",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	@import '../static/scss/_variable.scss';
	
	.search-box {
		.search-input {
			border-radius: 10px;
			border: 1px solid map-get($colors, 'border-grey');
		}
	}
</style>