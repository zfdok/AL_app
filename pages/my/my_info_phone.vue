<template>
	<view>
		<view class="steps">
			<u-steps :current="current_step">
				<u-steps-item title="当前" desc="询问状态">
				</u-steps-item>
				<u-steps-item title="修改" desc="修改手机号"></u-steps-item>
				<u-steps-item title="确认" desc="确认新手机号"></u-steps-item>
				<u-steps-item title="完成" desc="DONE"></u-steps-item>
			</u-steps>
		</view>
		<swiper class="swiper" :current="current_step" disable-touch>
			<swiper-item>
				<view class="swiper-item">
					<view class="steps_0">
						<view class="steps_0_title">
							当前手机号是否可用?
						</view>
						<view class="steps_0_phone">
							{{this.phone}}
						</view>
						<view class="steps_0_btn">
							<u-button type="primary" @click="old_useable_check">可用</u-button>
						</view>
						<view class="steps_0_btn">
							<u-button type="error" @click="current_step=1">不可用</u-button>
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="steps_1_old_useable" v-if="old_useable">
						<view class="steps_1_old_useable_title">
							请输入验证码:
						</view>
						<view class="steps_1_old_useable_code">
							<u-code-input size=60 fontSize=24 v-model="old_code_value" maxlength=4></u-code-input>
						</view>
						<view class="steps_0_btn">
							<u-button type="success" @click="send_old_code_toserver">验证</u-button>
						</view>
						<view class="steps_0_btn" v-show="resend_flag">
							<u-button type="warn" :disabled="resend_flag">
								重新发送({{countdown_seconds}})</u-button>
						</view>
						<view class="steps_0_btn" v-show="!resend_flag" @click="btn_resend">
							<u-button type="warning">
								重新发送</u-button>
						</view>
					</view>
					<view class="steps_1_old_disable" v-else>
						<view class="steps_1_old_disable_title">
							密码验证:
						</view>
						<view class="steps_1_old_disable_input">
							<u--input placeholder="请输入密码" password fontSize=26 border="surround"
								v-model="test_password1"></u--input>
						</view>
						<view class="steps_1_old_disable_input">
							<u--input placeholder="请再次输入您的密码" password fontSize=26 border="surround"
								v-model="test_password2"></u--input>
						</view>
						<u-button :disabled="!password_can_check" type="warning" @click="check_pass">验证密码</u-button>
					</view>

				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="steps_2_new_useable">
						<view class="steps_2_new_useable_title">
							请输入新手机号:
						</view>
						<view class="steps_2_new_useable_input">
							<u--input placeholder="请输入新手机号" border="surround" v-model="new_phone" type="number"
								clearable maxlength=11 fontSize=24 suffixIcon="phone"></u--input>
						</view>
						<view class="steps_0_btn" v-show="!new_resend_flag">
							<u-button type="warn" :disabled="resend_flag">
								重新发送({{countdown_seconds}})</u-button>
						</view>
						<view class="steps_0_btn" v-show="new_resend_flag">
							<u-button type="primary" @click="btn_new_resend" :disabled="!new_can_send">
								获取验证码</u-button>
						</view>
						<view class="steps_2_new_useable_title">
							请输入验证码:
						</view>
						<view class="steps_2_new_useable_code">
							<u-code-input :disabledKeyboard="!new_can_check" size=60 fontSize=24
								v-model="new_code_value" maxlength=4></u-code-input>
						</view>
						<view class="steps_0_btn">
							<u-button type="success" :disabled="!new_can_check" @click="send_new_code_toserver">验证
							</u-button>
						</view>

					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="steps_3">
						<img src='https://img.anlengyun.com/right.png'>
						<view class="steps_3_title">
							修改成功!
						</view>
						<button type="primary" @click="btn_ok_back">OK</button>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	let timer1 = null
	export default {
		data() {
			return {
				current_step: 0,
				old_useable: false,
				old_code_value: "",
				new_code_value: "",
				countdown_seconds: 60,
				resend_flag: true,
				new_resend_flag: true,
				new_phone: "",
				new_can_send: false,
				new_can_check: false,
				test_password1: "",
				test_password2: "",
				password_can_check: false,
			};
		},
		onLoad(options) {
			this.phone = options.phone
		},
		watch: {
			new_phone() {
				if (uni.$u.test.mobile(this.new_phone)) {
					this.new_can_send = true
				} else {
					this.new_can_send = false
					this.new_can_check = false
				}
			},
			test_password2() {
				if (this.test_password2 != "" && this.test_password2 == this.test_password1) {
					this.password_can_check = true
				} else {
					this.password_can_check = false
				}
			},
			test_password1() {
				if (this.test_password1 != "" && this.test_password2 == this.test_password1) {
					this.password_can_check = true
				} else {
					this.password_can_check = false
				}
			}
		},
		methods: {
			//获取验证码
			async get_sms_code(phoneNum) {
				//测试跳过用
				// return {
				// 	code: 200
				// }
				const params = {
					username: this.vuex_user.name,
					phoneNum,
				}
				let res = await this.$u.api.get_sms_code({
					params
				})
				return res
			},
			//验证验证码
			async check_sms_code(phoneNum, code) {
				const params = {
					username: this.vuex_user.name,
					phoneNum,
					code
				}
				let res = await this.$u.api.check_sms_code({
					params
				})
				return res
			},
			//旧手机可用,跳转至下一步,同时发短信
			old_useable_check() {
				this.old_useable = true
				this.old_send_msg()
				this.current_step = 1
			},
			//旧手机验证码接收按钮被点击
			btn_resend() {
				this.countdown_seconds = 60
				this.resend_flag = true
				this.old_send_msg()
			},
			//给旧手机发短信
			async old_send_msg() {
				let send_res = await this.get_sms_code(this.phone)
				if (send_res.code == 200) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'success',
						duration: 1000,
					})
				}
				timer1 = setInterval(() => {
					this.countdown_seconds--
					if (this.countdown_seconds == 0) {
						this.resend_flag = false
						clearInterval(timer1);
					}
				}, 1000)
			},
			//给新手机发短信
			async new_send_msg() {
				let send_res = await this.get_sms_code(parseInt(this.new_phone))
				if (send_res.code == 200) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'success',
						duration: 1000,
					})
				}
				timer1 = setInterval(() => {
					this.countdown_seconds--
					if (this.countdown_seconds == 0) {
						this.new_resend_flag = true
						clearInterval(timer1);
					}
				}, 1000)
			},
			//将旧手机验证码发给服务器
			async send_old_code_toserver() {
				let res = await this.check_sms_code(this.phone, parseInt(this.old_code_value))
				if (res.code == 200) {
					uni.showToast({
						title: '验证成功',
						icon: 'success',
						duration: 1000,
					})
					this.current_step = 2
					this.old_code_value = ""
					this.resend_flag = true
					clearInterval(timer1);
				} else {
					uni.showToast({
						title: '验证码错误',
						icon: 'error',
						duration: 1000,
					})
					this.old_code_value = ""
				}
			},
			//将新手机验证码发给服务器
			async send_new_code_toserver() {
				let res = await this.check_sms_code(this.phone, parseInt(this.new_code_value))
				if (res.code == 200) {
					uni.showToast({
						title: '验证成功',
						icon: 'success',
						duration: 1000,
					})
					this.current_step = 3
					this.new_code_value = ""
					clearInterval(timer1);
					let params = {
						username: this.vuex_user.name,
						phone: this.new_phone
					}
					this.$u.api.change_phone({
						params
					})
				} else {
					uni.showToast({
						title: '验证码错误',
						icon: 'error',
						duration: 1000,
					})
					this.new_code_value = ""
				}
			},
			//新手机验证码接收按钮被点击
			btn_new_resend() {
				this.countdown_seconds = 60
				this.new_resend_flag = false
				this.new_send_msg()
				this.new_can_check = true
			},
			//完成设置返回info页
			btn_ok_back() {

				this.current_step = 0
				uni.$u.route({
					url: 'pages/my/my_info',
				})
			},
			//验证密码
			async check_pass() {
				const params = {
					username: this.vuex_user.name,
					password: this.test_password2,
				}
				let res = await this.$u.api.check_password({
					params
				})
				if (res.code == 200) {
					this.test_password1 = ''
					this.test_password2 = ''
					this.current_step = 2
					uni.showToast({
						title: "密码验证成功!",
						icon: 'success',
						duration: 1000
					})
				} else {
					this.test_password1 = ''
					this.test_password2 = ''
					uni.showToast({
						title: "密码错误!",
						icon: 'error',
						duration: 1000
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.steps {
		margin: 40rpx;
	}

	.swiper {
		margin: 40rpx;
		height: 800rpx;

		.steps_0 {
			text-align: center;

			.steps_0_title {
				font-size: 50rpx;
				color: #666;
			}

			.steps_0_phone {
				font-size: 65rpx;
				color: #ff7c30;
				font-weight: 600;
			}

		}

		.steps_0_btn {
			margin-top: 40rpx;
			padding-left: 60rpx;
			padding-right: 60rpx;
		}

		.steps_1_old_useable {
			text-align: center;

			.steps_1_old_useable_title {
				font-size: 50rpx;
				color: #666;
				margin-bottom: 40rpx;
			}

			.steps_1_old_useable_code {
				display: flex;
				justify-content: center;
				margin-bottom: 40rpx;
			}
		}

		.steps_1_old_disable {
			text-align: center;

			.steps_1_old_disable_title {
				font-size: 50rpx;
				color: #666;
				margin-bottom: 40rpx;
			}
		}

		.steps_1_old_disable_input {
			margin-bottom: 40rpx;
		}

		.steps_2_new_useable {
			text-align: center;

			.steps_2_new_useable_title {
				font-size: 50rpx;
				color: #666;
				margin-bottom: 40rpx;
				margin-top: 40rpx;
			}

			.steps_2_new_useable_input {
				margin-left: 50rpx;
				margin-right: 50rpx;
			}

			.steps_2_new_useable_code {
				display: flex;
				justify-content: center;
				margin-bottom: 40rpx;
			}
		}

		.steps_3 {
			text-align: center;

			.steps_3_title {
				font-size: 50rpx;
				color: #666;
				margin-bottom: 40rpx;
				margin-top: 40rpx;
			}
		}
	}
</style>
