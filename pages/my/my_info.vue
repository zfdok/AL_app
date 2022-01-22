<template>
	<view class="content">
		<view class="userback">
			<img :src="user.usericon">
			<view class="back_arrow" @click="back_arrow_click">
				<icon type="clear" size="26" />
				<!-- <u-icon name="arrow-left" bold size="30" color="#2979ff"></u-icon> -->
			</view>
			<view class="userback_info">
				<view class="userback_info_name">
					<u-tag :text="`账号:${user.username}`" plain size="mini"></u-tag>
				</view>
				<view class="userback_info_role">
					<u-tag :text="user.user_role_name" plain size="mini" type="warning"></u-tag>
				</view>
			</view>
		</view>
		<view class="userinfo">
			<u--form labelPosition="left" labelWidth=100 :model="user" ref="form1">
				<u-form-item label="账号昵称:" prop="user.user_group_name" borderBottom ref="item1">
					<u--input v-model="user.user_group_name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="所属公司:" prop="user.commpany" borderBottom ref="item1">
					<u--input v-model="user.commpany" border="none"></u--input>
				</u-form-item>
				<u-form-item label="邮寄地址:" prop="user.address" borderBottom ref="item1">
					<u--textarea v-model="user.address" autoHeight count placeholder="请输入地址"></u--textarea>
				</u-form-item>
				<u-form-item label="电子邮箱:" prop="user.email" borderBottom ref="item1">
					<u--input v-model="user.email" border="none"></u--input>
				</u-form-item>
				<u-form-item label="手机号码:" prop="user.phone" borderBottom ref="item1">
					<view class="input_input">
						<view class="input_input_input">
							<u--input disabled v-model="user.phone" border="none">
							</u--input>
						</view>
						<view class="input_input_btn">
							<u-button text="修改手机号" type="primary" size="mini" @tap="btn_phone_set"></u-button>
						</view>
					</view>
				</u-form-item>
				<view class="user_info_btn">
					<u-button class="user_info_btn" type="primary" @tap="btn_set">确认修改</u-button>
				</view>
				<view class="user_info_btn">
					<u-button class="user_info_btn" type="warning" @click="btn_change_pass">修改密码</u-button>
				</view>
				<view class="user_info_btn">
					<u-button class="user_info_btn" type="error" @click="logout">退出登录</u-button>
				</view>
			</u--form>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				user: {
					username: "admin",
					user_group_name: "客户00001",
					user_role_name: "管理员",
					user_role: 1,
					email: null,
					commpany: "山东安冷",
					usericon: 'https://img.anlengyun.com/user_avatar.png',
					address: "山东省泰安市泰山区灵山大街国家小区18楼1单元",
					phone: "15853823881",
					create_time: "2021-04-14 10:04:40",
					last_login: "2021-04-14 10:04:40",
					sms_account: 100,
					sms_span: 10,
					sms_day_limit: 30,
				}
			}
		},
		onLoad() {

		},
		onShow() {
			console.log("reget")
			this.get_userinfo()
		},
		methods: {
			async get_userinfo() {
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 6000)
				let params = {
					name: this.vuex_user.name
				}
				let res = await this.$u.api.get_user_info({
					params
				})
				this.user = res.data
				setTimeout(() => {
					uni.hideLoading();
				}, 500)
			},
			async btn_set() {
				uni.showLoading({
					title: '设置中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 6000)
				let params = {
					username: this.user.username,
					user_group_name: this.user.user_group_name,
					commpany: this.user.commpany,
					address: this.user.address,
					email: this.user.email,
					sms_span: this.user.sms_span,
					sms_day_limit: this.user.sms_day_limit
				}
				let res = await this.$u.api.set_user_info({
					params
				})
				uni.showLoading({
					title: '设置完成',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 500)
			},
			async btn_phone_set() {
				uni.$u.route({
					url: 'pages/my/my_info_phone',
					params: {
						phone: this.user.phone
					}
				})
			},
			back_arrow_click() {
				uni.navigateBack();
			},
			logout() {
				this.$u.vuex('vuex_token', "")
				uni.$u.route({
					type: 'reLaunch',
					url: 'pages/auth/login',
				})
			},
			async btn_change_pass() {
				uni.$u.route({
					url: 'pages/my/my_info_pass',
					params: {
						phone: this.user.phone
					}
				})
			},

		}
	}
</script>
<style lang="scss">
	.content {
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-image: url('/static/myback3.png');
		background-repeat: no-repeat;
		background-size: 100%;
		text-align: center
	}

	.back_arrow {
		position: fixed;
		left: 50rpx;
		top: 100rpx;

		.back_arrow_title {

			font-size: 80rpx;
		}
	}

	.userback img {
		margin: auto;
		border-radius: 51px;
		margin-top: 21%;
		width: 97px;
		height: 97px;
	}

	.userback_info {
		display: flex;
		justify-content: center;

		.userback_info_name {
			width: 180rpx;
			margin-right: 10rpx;
			text-align: center;
			// flex-grow: 1;
		}

		.userback_info_role {
			width: 100rpx;
			text-align: center;
			// flex-grow: 1;
		}
	}

	.userinfo {
		margin-top: 40rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		margin-bottom: 40rpx;
		padding: 40rpx;
		padding-top: 10rpx;
		box-shadow: 2px 2px 5px #8b8b8b;
		border-radius: 20rpx;
		background-color: #fafafa;
		overflow: scroll;

		.input_input {
			display: flex;
			justify-content: space-between;

			.input_input_input {
				flex-grow: 2;
			}

			.input_input_btn {
				flex-grow: 1;
			}
		}
	}

	.user_info_btn {
		margin-top: 30rpx;
	}
</style>
