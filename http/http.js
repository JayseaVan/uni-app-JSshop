const BASE_URL = 'https://api-hmugo-web.itheima.net/api/public/v1';

// 同时发送异步代码的次数
let httpTimes = 0;

export const http = (options) => {
	httpTimes++;
	
	// 显示首页白屏 加载 过渡动画效果
	uni.showLoading({
		title: '加载中',
		mask:true
	});
	
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header:options.header || {},
			success: (res) => {
				/* if(res.data.status !== 0) { // 如果res.data.status  === 0，则接口请求成功，否则失败
					return uni.showToast({ // 显示消息提示框
						title: '获取数据失败'
					})
				} */
				// console.log(res);
				if (res.statusCode === 200) {
					resolve(res);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err);
			},
			complete: () => {
				httpTimes--;
				if (httpTimes === 0) {
					// 关闭加载动画
					uni.hideLoading();
				}
			}
		});
	})
}