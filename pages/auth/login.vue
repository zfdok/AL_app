<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录安冷云{{user_name}}</view>
			<input class="u-border-bottom" v-model="user_name" placeholder="请输入账号" />
			<input class="u-border-bottom" type="password" v-model="user_pass" placeholder="请输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password">找回密码</view>
				<view class="issue">注册</view>
			</view>
		</view>
		<view class="buttom">
			<view class="loginType">
			</view>
			<view class="hint">
				登录代表同意
				<text class="link">安冷云用户协议、隐私政策，</text>
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
				user_pass: ''
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
			async submit() {
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
							title:"登录成功",
							type:'success'
						})
						setTimeout(() => {
							uni.$u.route({
								type: 'reLaunch',
								url: 'pages/index/index',
							})
						}, 1000)
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.u-border-bottom {
		margin-top: 30px;
	}

	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
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

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
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
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $u-warning;
				}
			}
		}
	}
</style>
