<template>
	<view>
		<button
		class="mt-4 mx-5" 
		type="warn" 
		plain="true" 
		@click="handleGetUserProfile">授权</button>
	</view>
</template>

<script>
	import { showModal, login, getUserProfile } from '../../plugin/async.js';
	
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			async handleGetUserProfile() {
				const res = await showModal({content: '授权微信登录后才能正常使用小程序功能'});
				if (res.confirm) {
					// 1. 获取用户信息
					const { encryptedData, rawData, iv, signature } = await getUserProfile({desc: '获取你的昵称、头像、地区及性别'});
					// 2. 获取小程序登录成功后的code
					const { code } = await login();
					// 3. 发送请求，获取用户的token
					const loginParams = { encryptedData, rawData, iv, signature, code };
					// console.log(loginParams);
					const result = await this.$http({
					    url: '/users/wxlogin',
					    data: loginParams,
					    method: "POST"
					});
					// console.log(result); 此处需要企业版微信账号的Appid才能成功获取到token，否则使用个人微信返回null
					const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
					// 4.把token存入缓存中
					uni.setStorageSync("token", token);
					uni.navigateBack({
						delta: 1
					})
				} else if (res.cancel) {
					//如果用户点击了取消按钮
					wx.showToast({
						title: '您拒绝了请求,不能正常使用小程序',
						icon: 'error',
						duration: 2000
					});
					return;
				}
			}
		}
	}
</script>

<style>

</style>
