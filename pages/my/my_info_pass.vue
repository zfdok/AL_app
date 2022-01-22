<template>
	<view>
		<view class="steps">
			<u-steps :current="current_step">
				<u-steps-item title="当前" desc="询问状态">
				</u-steps-item>
				<u-steps-item title="验证" desc="手机验证"></u-steps-item>
				<u-steps-item title="修改" desc="修改密码"></u-steps-item>
				<u-steps-item title="完成" desc="DONE"></u-steps-item>
			</u-steps>
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
								密码验证
							</view>
							<view class="steps_1_old_disable_input">
								<u--input placeholder="请输旧密码" password fontSize=20 border="surround"
									v-model="old_password"></u--input>
							</view>
							<u-button type="warning" @click="check_pass">验证密码</u-button>
							<u-button class="forget_pass" type="error" @click="check_pass">忘记密码</u-button>
						</view>

					</view>
				</swiper-item>
				<swiper-item>
					<view class="steps_1_old_disable_title">
						请输入新密码
					</view>
					<view class="steps_1_old_disable_input">
						<u--input placeholder="请输新密码" password fontSize=22 border="surround" v-model="new_password1">
						</u--input>
					</view>
					<view class="steps_1_old_disable_input">
						<u--input placeholder="请再次输入新密码" password fontSize=22 border="surround" v-model="new_password2">
						</u--input>
					</view>
					<u-button :disabled="!password_can_check" type="warning" @click="btn_change_pass">修改密码</u-button>
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
	</view>
</template>

<script>
	let timer1 = null
	export default {
		data() {
			return {
				phone: '',
				current_step: 0,
				old_useable: false,
				old_code_value: "",
				countdown_seconds: 10,
				resend_flag: true,
				old_password: "",
				password_can_check: false,
				new_password1: "",
				new_password2: "",
			};
		},
		onLoad(options) {
			this.phone = options.phone
		},
		watch: {
			new_password2() {
				if (this.new_password2.length >= 6 && this.new_password2 != "" && this.new_password2 == this
					.new_password1) {
					this.password_can_check = true
				} else {
					this.password_can_check = false
				}
			},
			new_password1() {
				if (this.new_password1.length >= 6 && this.new_password1 != "" && this.new_password2 == this
					.new_password1) {
					this.password_can_check = true
				} else {
					this.password_can_check = false
				}
			}
		},
		methods: {
			//旧手机验证码接收按钮被点击
			btn_resend() {
				this.countdown_seconds = 10
				this.resend_flag = true
				this.old_send_msg()
			},
			//旧手机可用,跳转至下一步,同时发短信
			old_useable_check() {
				this.old_useable = true
				this.old_send_msg()
				this.current_step = 1
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
			//验证密码
			async check_pass() {
				const params = {
					username: this.vuex_user.name,
					password: this.old_password,
				}
				let res = await this.$u.api.check_password({
					params
				})
				if (res.code == 200) {
					this.old_password = ''
					this.current_step = 2
					uni.showToast({
						title: "密码验证成功!",
						icon: 'success',
						duration: 1000
					})
				} else {
					this.old_password = ''
					uni.showToast({
						title: "密码错误!",
						icon: 'error',
						duration: 1000
					})
				}

			},
			//修改密码
			async btn_change_pass() {
				const params = {
					username: this.vuex_user.name,
					password: this.new_password2,
				}
				this.$u.api.change_pass({
					params
				})
				uni.showToast({
					title: '已发送',
					icon: 'success',
					duration: 500,
				})
				this.current_step = 3
				setTimeout(() => {
					this.$u.vuex('vuex_token', "")
					this.current_step = 0
					uni.showToast({
						title: '请重新登录',
						icon: 'error',
						duration: 500,
					})
					uni.$u.route({
						type: 'reLaunch',
						url: 'pages/auth/login',
					})
				}, 10000)
			},
			//完成设置返回info页
			btn_ok_back() {
				this.current_step = 0
				this.$u.vuex('vuex_token', "")
				uni.$u.route({
					type: 'reLaunch',
					url: 'pages/auth/login',
				})
			},
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


		}

		.forget_pass {
			margin-top: 40rpx;
		}

		.steps_1_old_disable_title {
			font-size: 50rpx;
			color: #666;
			margin-bottom: 40rpx;
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
