const http = uni.$u.http

const install = (Vue, vm) => {
	// const login = (params, config = {}) => http.post('/user/login', params, config)
	//---------------用户相关----------------------//
	// 登录
	const login = (params) => http.post('/user/login', params)
	// 验证token
	const checktoken = () => http.get('/user/checktoken')
	// 验证用户密码
	const check_password = (params) => http.post('/user/check_password', params)
	// 获取用户信息
	const get_user_info = (params) => http.get('/user/get_user_info', params)
	// 设置用户信息
	const set_user_info = (params) => http.get('/user/set_user_info', params)
	// 获取用户设备信息
	const get_user_device_info = (params) => http.get('/user/get_user_device_info', params)
	// 重置用户今日短信额度
	const update_sms_day_limit = (params) => http.get('/user/update_sms_day_limit', params)
	// 获取验证码
	const get_sms_code = (params) => http.get('/user/get_sms_code', params)
	// 验证验证码
	const check_sms_code = (params) => http.get('/user/check_sms_code', params)
	// 修改密码
	const change_pass = (params) => http.post('/user/change_pass', params)
	// 修改手机
	const change_phone = (params) => http.get('/user/set_user_phone', params)
	//---------------设备相关----------------------//
	// 获取设备清单
	const get_user_devicelist_by_type = (params) => http.get('/onenet/get_user_devicelist_by_type', params)
	// 获取某设备信息
	const get_device = (params) => http.get('/onenet/get_device', params)
	// 获取某设备最新温湿度信息
	const get_device_latest = (params) => http.get('/onenet/get_device_latest', params)
	// 获取某设备最新定位信息
	const get_device_latest_lbs = (params) => http.get('/onenet/get_device_latest_lbs', params)
	// 获取某设备的期望值信息
	const get_device_desired = (params) => http.get('/onenet/get_device_desired', params)
	// 设置某设备的名称
	const set_device_name = (params) => http.get('/onenet/set_device_name', params)
	// 设置某设备的名称
	const set_device_desired = (params) => http.get('/onenet/set_device_desired', params)
	//---------------消息相关----------------------//
	// 获取用户消息
	const get_headernotice = (params) => http.get('/headernotice/getnotice', params)
	// 消息设置已读
	const readnotice = (params) => http.post('/headernotice/readnotice', params)
	//---------------历史记录相关----------------------//
	// 获取设备历史记录清单
	const get_device_history_list = (params) => http.get('/history/get_device_history_list', params)
	// 获取设备历史记录
	const get_device_history = (params) => http.get('/history/get_device_history', params)
	get_device_history
	vm.$u.api = {
		login,
		change_pass,
		change_phone,
		checktoken,
		check_password,
		get_user_info,
		set_user_info,
		get_user_device_info,
		update_sms_day_limit,
		get_sms_code,
		check_sms_code,
		get_user_devicelist_by_type,
		get_device,
		get_device_latest,
		get_device_latest_lbs,
		get_device_desired,
		set_device_name,
		set_device_desired,
		get_headernotice,
		readnotice,
		get_device_history_list,
		get_device_history,
	}
}

export default {
	install
}
