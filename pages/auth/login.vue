<template>
	<view class="wrap">
		<u-toast ref="uToast"></u-toast>
		<view class="content">
			<view class="title">欢迎登录安冷云</view>
			<u--image src="../../static/180x180.png" mode="aspectFit" fade duration="1000" width="100%" height="200rpx">
			</u--image>
			<u-gap height="30rpx"></u-gap>
			<u--input class="u-border-bottom" v-model="user_name" placeholder="请输入账号" prefixIcon="account-fill"
				size="48rpx" autoBlur clearable shape="circle" fontSize="36rpx" />
			<u-gap height="30rpx"></u-gap>
			<u--input class="u-border-bottom" type="password" v-model="user_pass" placeholder="请输入密码"
				prefixIcon="lock-fill" size="48rpx" autoBlur clearable shape="circle" fontSize="36rpx" />
			<u-gap height="60rpx"></u-gap>
			<u-button @tap="submit" :style="[inputStyle]" class="getCaptcha" shape="circle" size="large">登录</u-button>
			<view class="alternative">
				<!-- <view class="password">找回密码</view> 
				<view class="issue">注册</view> -->
			</view>
		</view>
		<view class="button">
			<view class="loginType">
			</view>
			<view class="hint" :class="provacy_style">
				<u-checkbox-group class="provacy_radio" v-model="provacy_agreed" activeColor="#00b849"
					inactiveColor="#f90000">
					<u-checkbox label="请勾选同意" name="同意" shape="circle" labelSize="22rpx">
					</u-checkbox>
				</u-checkbox-group>

				<u-link color="#ffaa00" fontSize="22rpx" class="link"
					href="https://anlengyun.com/privacy/service_privacy.html" text="《安冷云用户协议》、"></u-link>
				<u-link color="#ffaa00" fontSize="22rpx" class="link"
					href="https://anlengyun.com/privacy/secret_privacy.html" text="《安冷云隐私政策》，"></u-link>
				并授权使用您的安冷云账号信息（如昵称、头像、收货地址）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_name: '',
				user_pass: '',
				provacy_agreed: [],
				provacy_style: ""
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (uni.$u.test.rangeLength(this.user_name, [4, 16]) && uni.$u.test.rangeLength(this.user_pass, [4, 16])) {
					style.color = "#fff";
					style.backgroundColor = "#2980b9";
				}
				return style;
			}
		},
		methods: {
			// 提交按钮
			async submit() {
				// 是否同意隐私
				if (this.provacy_agreed.length == 0) {
					this.$refs.uToast.show({

						type: 'error',
						icon: false,
						title: '失败主题',
						message: "请先阅读用户协议及隐私政策",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
					this.provacy_style = "shake-slow"
					setTimeout(() => {
						this.provacy_style = ""
					}, 500)
					return
				}
				// 用户名是否合规
				if (uni.$u.test.rangeLength(this.user_name, [4, 16]) && uni.$u.test.rangeLength(this.user_pass, [4,
						16
					])) {
					const login_res = await this.$u.api.login({
						name: this.user_name,
						password: this.user_pass
					})
					if (login_res.code === 200) {
						this.$u.vuex('vuex_token', login_res.data.token)
						this.$u.vuex('vuex_user', login_res.data.user)
						uni.showToast({
							title: "登录成功",
							type: 'success'
						})
						setTimeout(() => {
							uni.$u.route({
								type: 'reLaunch',
								url: 'pages/index/index',
							})
						}, 1000)
					}
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		position: absolute;
		padding-top: 60px;
		font-size: 28rpx;
		background-color: #fefefe;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			.input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: $u-info;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				margin-top: 30rpx;
				background-color: #bbdfff;
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.button {
			.loginType {
				display: flex;
				padding: 110rpx;
				justify-content: space-between;
				height: 70px;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 22rpx;
				color: $u-tips-color;

				.provacy_radio {
					display: inline-block;
				}

				.link {
					color: $u-warning;
					display: inline;
				}
			}
		}
	}

	@keyframes shake-slow {
		2% {
			transform: translate(6px, -2px) rotate(3.5deg);
		}

		4% {
			transform: translate(5px, 8px) rotate(-0.5deg);
		}

		6% {
			transform: translate(6px, -3px) rotate(-2.5deg);
		}

		8% {
			transform: translate(4px, -2px) rotate(1.5deg);
		}

		10% {
			transform: translate(-6px, 8px) rotate(-1.5deg);
		}

		12% {
			transform: translate(-5px, 5px) rotate(1.5deg);
		}

		14% {
			transform: translate(4px, 10px) rotate(3.5deg);
		}

		16% {
			transform: translate(0px, 4px) rotate(1.5deg);
		}

		18% {
			transform: translate(-1px, -6px) rotate(-0.5deg);
		}

		20% {
			transform: translate(6px, -9px) rotate(2.5deg);
		}

		22% {
			transform: translate(1px, -5px) rotate(-1.5deg);
		}

		24% {
			transform: translate(-9px, 6px) rotate(-0.5deg);
		}

		26% {
			transform: translate(8px, -2px) rotate(-1.5deg);
		}

		28% {
			transform: translate(2px, -3px) rotate(-2.5deg);
		}

		30% {
			transform: translate(9px, -7px) rotate(-0.5deg);
		}

		32% {
			transform: translate(8px, -6px) rotate(-2.5deg);
		}

		34% {
			transform: translate(-5px, 1px) rotate(3.5deg);
		}

		36% {
			transform: translate(0px, -5px) rotate(2.5deg);
		}

		38% {
			transform: translate(2px, 7px) rotate(-1.5deg);
		}

		40% {
			transform: translate(6px, 3px) rotate(-1.5deg);
		}

		42% {
			transform: translate(1px, -5px) rotate(-1.5deg);
		}

		44% {
			transform: translate(10px, -4px) rotate(-0.5deg);
		}

		46% {
			transform: translate(-2px, 2px) rotate(3.5deg);
		}

		48% {
			transform: translate(3px, 4px) rotate(-0.5deg);
		}

		50% {
			transform: translate(8px, 1px) rotate(-1.5deg);
		}

		52% {
			transform: translate(7px, 4px) rotate(-1.5deg);
		}

		54% {
			transform: translate(10px, 8px) rotate(-1.5deg);
		}

		56% {
			transform: translate(-3px, 0px) rotate(-0.5deg);
		}

		58% {
			transform: translate(0px, -1px) rotate(1.5deg);
		}

		60% {
			transform: translate(6px, 9px) rotate(-1.5deg);
		}

		62% {
			transform: translate(-9px, 8px) rotate(0.5deg);
		}

		64% {
			transform: translate(-6px, 10px) rotate(0.5deg);
		}

		66% {
			transform: translate(7px, 0px) rotate(0.5deg);
		}

		68% {
			transform: translate(3px, 8px) rotate(-0.5deg);
		}

		70% {
			transform: translate(-2px, -9px) rotate(1.5deg);
		}

		72% {
			transform: translate(-6px, 2px) rotate(1.5deg);
		}

		74% {
			transform: translate(-2px, 10px) rotate(-1.5deg);
		}

		76% {
			transform: translate(2px, 8px) rotate(2.5deg);
		}

		78% {
			transform: translate(6px, -2px) rotate(-0.5deg);
		}

		80% {
			transform: translate(6px, 8px) rotate(0.5deg);
		}

		82% {
			transform: translate(10px, 9px) rotate(3.5deg);
		}

		84% {
			transform: translate(-3px, -1px) rotate(3.5deg);
		}

		86% {
			transform: translate(1px, 8px) rotate(-2.5deg);
		}

		88% {
			transform: translate(-5px, -9px) rotate(2.5deg);
		}

		90% {
			transform: translate(2px, 8px) rotate(0.5deg);
		}

		92% {
			transform: translate(0px, -1px) rotate(1.5deg);
		}

		94% {
			transform: translate(-8px, -1px) rotate(0.5deg);
		}

		96% {
			transform: translate(-3px, 8px) rotate(-1.5deg);
		}

		98% {
			transform: translate(4px, 8px) rotate(0.5deg);
		}

		0%,
		100% {
			transform: translate(0, 0) rotate(0);
		}
	}

	.shake-slow {
		animation: shake-slow 2s infinite ease-in-out;
	}
</style>
