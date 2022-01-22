<template>
	<view class="content">
		<view class="setting_card">
			<view class="setting_card_title">
				短信账户
			</view>
			<u--form labelPosition="left" labelWidth=110 :model="user" ref="form1">
				<u-form-item label="短信账户余额:" prop="user.sms_account" borderBottom ref="item1">
					<view class="input_input">
						<view class="input_input_input">
							<u--input disabled v-model="user.sms_account" border="none"></u--input>
						</view>
						<view class="input_input_btn">
							<u-button text="去充值" type="success" size="mini" @click="charge_sms"></u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="今日剩余条数:" prop="user.sms_day_count" borderBottom ref="item1">
					<view class="input_input">
						<view class="input_input_input">
							<u--input disabled v-model="user.sms_day_count" border="none"></u--input>
						</view>
						<view class="input_input_btn">
							<u-button text="重置今日" type="primary" size="mini" @click="reset_sms"></u-button>
						</view>
					</view>
				</u-form-item>
				<u-form-item label="短信发送间隔:" prop="user.sms_span" borderBottom ref="item1">
					每
					<u-number-box v-model="user.sms_span" integer :min="1" :max="100"></u-number-box>
					分钟一条
				</u-form-item>
				<u-form-item label="单日最大条数:" prop="user.sms_day_limit" borderBottom ref="item1">
					单日最多
					<u-number-box v-model="user.sms_day_limit" integer :min="1" :max="100"></u-number-box>
					条
				</u-form-item>
			</u--form>
			<u-button class="submit_btn" type="primary" @click="submit">提交</u-button>
		</view>
		<u-modal :show="charge_show" title="请联系客服" @confirm="charge_show=false">
			<view class="slot-content ">
				<u-avatar shape="square" size=250 src='https://img.anlengyun.com/my_wechat.jpg'></u-avatar>
			</view>
		</u-modal>
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
					sms_day_count: 30,
				},
				charge_show: false
			};
		},
		onShow() {
			this.get_userinfo()
			uni.showToast({
				title: '加载中...',
				duration:1000,
				icon:'loading'
			})
		},
		methods: {
			async submit() {
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
				this.get_userinfo()
			},
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
			async charge_sms() {
				this.charge_show = true
			},
			async reset_sms() {
				if (this.user.sms_day_count == this.user.sms_day_limit) {
					return uni.showToast({
						title: '无需重置',
						icon: 'error',
						duration: 1000,
					})
				}
				let params = {
					username: this.user.username,
					num: this.user.sms_day_limit
				}
				let res = await this.$u.api.update_sms_day_limit({
					params
				})
				this.user.sms_day_count = this.user.sms_day_limit
				uni.showToast({
					title: '重置完成',
					icon: 'success',
					duration: 1000,
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-image: url("/static/myback.png");
		background-size: 100%;
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
	}

	.setting_card {
		position: fixed;
		top: 200rpx;
		bottom: 300rpx;
		left: 60rpx;
		right: 60rpx;
		z-index: -1;
		background-color: #fff;
		padding: 40rpx;

		border: {
			radius: 20rpx;
		}

		;
		box-shadow: 2px 2px 3px #4c4c4c;

		.setting_card_title {
			font-size: 60rpx;
			color: #676767;
			font-weight: 600;
			margin-bottom: 20rpx;
		}

		.submit_btn {
			width: 100%;
			position: relative;
			bottom: -80px; //table.height - div_height
		}
	}

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
	.modal_weichat{
		width: 100%;
	}
</style>
