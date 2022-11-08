<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 引入字体图标 */
	@import url('static/fonts/iconfont.css');
	
	/* 引入公共样式 */
	@import './static/scss/style.scss';
</style>
