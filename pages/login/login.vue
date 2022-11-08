<template>
	<view>
		<!-- open-type="getUserInfo" 获取用户信息，可以从@getuserinfo回调中获取到用户信息 -->
		<button 
		class="mt-4 mx-5" 
		type="warn" 
		plain="true" 
		@click="handleGetUserProfile">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userProfile: []
			}
		},
		methods: {
			// https://blog.csdn.net/qq_41389354/article/details/122146529
			handleGetUserProfile(e) {
			    var _this = this
			    wx.showModal({
			      title: '温馨提示',
			      content: '亲，授权微信登录后才能正常使用小程序功能',
			      success(res) {
			        console.log(res)
			        //如果用户点击了确定按钮
			        if (res.confirm) {
			          wx.getUserProfile({
			            desc: '获取你的昵称、头像、地区及性别',
			            success: res => {
						  console.log(res.userInfo);
						  uni.setStorageSync("userInfo", res.userInfo);
						  uni.navigateBack({
							  delta: 1
						  });
			              // console.log(res);
			              // console.log(1);
			            },
			            fail: res => {
			              console.log(res)
			              //拒绝授权
			              wx.showToast({
			                title: '您拒绝了请求,不能正常使用小程序',
			                icon: 'error',
			                duration: 2000
			              });
			              return;
			            }
			          });
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
			    });
			}
		},
	}
</script>

<style>

</style>
