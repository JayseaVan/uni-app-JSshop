/**
 * promise 形式 showToast
 * @param {object} param0 参数
 */
export const showToast = ({title}) => {
	return new Promise((resolve, reject) => {
		wx.showToast({
			title: title,
			icon: 'none',
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * promise 形式 showModal
 * @param {object} param0 参数
 */
export const showModal = ({content}) => {
	return new Promise((resolve, reject) => {
		wx.showModal({
			title: '温馨提示',
			content: content,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			},
			complete: () => {}
		})
	})
}



/**
 * promise 形式 login 
 */
export const login = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			timeout: 10000,
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

/**
 * promise 形式 getUserProfile
 * @param {object} param0 参数
 */
export const getUserProfile = ({desc}) => {
	return new Promise((resolve, reject) => {
		wx.getUserProfile({
			desc: desc,
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}