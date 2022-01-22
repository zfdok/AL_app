// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = 'https://anlengyun.com:3000'; /* 根域名 */
		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		config.header.authorization = "Bearer " + vm.vuex_token
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom
		if (data.code !== 200 && data.code !== 0) {
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (data.code == 401) {
				if (custom.toast !== false) {
					uni.$u.toast(data.message)
					uni.$u.route({
						type: 'reLaunch',
						url: 'pages/auth/login',
					})
				}
			} else if (data.code == 422) {
				if (custom.toast !== false) {
					uni.$u.toast("请求参数错误")
				}
			} else {
				if (custom.toast !== false) {
					uni.$u.toast(data.message)
				}
			}
			return data
		}
		return data.data === undefined ? {} : data
	}, (response) => {
		uni.$u.toast("请求失败")
		return Promise.reject(response)
	})
}
