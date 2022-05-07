<template>
	<view class="content">
		<view class="user-box" @click="to_page_my_info">
			<u-avatar class="user_avatar" src="https://img.anlengyun.com/user_avatar.png" size="50"></u-avatar>
			<view class="user_info">
				<view class="user_info_name">{{vuex_user.name}}</view>
				<view class="user_info_role">{{vuex_user.position.CN}}</view>
			</view>
			<view class="user_arrow">
				<u-icon name="arrow-right" color="#ffffff" size="24"></u-icon>
			</view>
		</view>
		<view class="account">
			<view class="account_presure" @click="to_page_my_money">
				<u-cell-group>
					<u-cell icon="rmb-circle" title="短信账户管理">
						<u-icon slot="right-icon" size="18" name="arrow-right"></u-icon>
					</u-cell>
				</u-cell-group>
			</view>
			<view class="account_device" @click="to_page_my_device">
				<u-cell-group>
					<u-cell icon="grid" title="设备有效期管理">
						<u-icon slot="right-icon" size="18" name="arrow-right"></u-icon>
					</u-cell>
				</u-cell-group>
			</view>

			<view class="u-m-t-20">
				<u-cell-group>
					<u-cell icon="setting" title="默认启动页" @click="default_page_show=true">
					</u-cell>
					<u-cell icon="photo" title="默认设备类型" @click="default_product_show=true">
					</u-cell>
					<!-- 					<u-cell icon="coupon" title="常见问题" @click="to_page_my_question">
						<u-icon slot="right-icon" size="18" name="arrow-right"></u-icon>
					</u-cell> -->
					<!-- 				<u-cell icon="heart" title="设备使用说明" @click="to_page_my_introduce">
						<u-icon slot="right-icon" size="18" name="arrow-right"></u-icon>
					</u-cell> -->
					<u-cell icon="eye" title="版本信息及更新" @click="get_update">
					</u-cell>
					<u-cell icon="more-circle" title="服务条款及隐私" @click="to_page_my_privacy">
						<u-icon slot="right-icon" size="18" name="arrow-right"></u-icon>
					</u-cell>
					<u-cell icon="server-fill" title="联系我们" @click="service_show=true">
					</u-cell>
				</u-cell-group>
			</view>
			<view class="u-m-t-20">
				<u-cell-group class="account_logout">
					<u-cell icon="setting" title="退出登录" @click="btn_logout"></u-cell>
				</u-cell-group>
			</view>
		</view>
		<u-picker :show="default_page_show" :columns="default_page_columns" @confirm="default_page_confirm"
			@cancel="default_page_show = false"></u-picker>
		<u-picker :show="default_product_show" :columns="default_product_columns" @confirm="default_product_confirm"
			@cancel="default_product_show = false"></u-picker>
		<u-modal :show="update_show" title="版本更新" @confirm="update_confim" :confirmText="new_version_confirmText">
			<view class="slot-content">
				<rich-text :nodes="new_version_text"></rich-text>
				<rich-text class="version_info" :nodes="`当前版本:${this.vuex_version}`"></rich-text>
			</view>
		</u-modal>
		<u-modal :show="service_show" title="联系我们" @confirm="serveice_confim" closeOnClickOverlay
			@close="service_show=false">
			<view class="slot-content">
				<u-link class="service_link" href="tel:0538-8926007" text="客服电话: 0538-8926007"></u-link>
				<u-link class="service_link" href="http://www.anleng-tec.com/" text="安冷科技官网: anleng-tec.com">
				</u-link>
				<u-link class="service_link" href="https://anlengyun.com/" text="安冷云官网: anlengyun.com"></u-link>
				<u-link class="service_link" href="mailto:sdalkj@126.com" text="发送邮件: sdalkj@126.com"></u-link>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic: 'https://uviewui.com/common/logo.png',
				default_page_show: false,
				default_page_columns: [
					["首页", "设备", "数据", "消息"]
				],
				default_product_show: false,
				default_product_columns: [
					["在线温湿度监测仪", "蓝牙记录仪", "医疗保温箱", "智慧冷库", "智能保温箱", "冷链车", "冷藏集装箱"]
				],
				update_show: false,
				service_show: false,
				new_version: '1.0.1',
				new_version_confirmText: 'OK',
				new_version_text: "已更新至最新版本"
			};
		},
		onLoad() {
			if (!this.$u.utils.isLogin()) return
		},
		methods: {
			btn_logout() {
				this.$u.vuex('vuex_token', "")
				uni.$u.route({
					type: 'reLaunch',
					url: 'pages/auth/login',
				})
			},
			default_page_confirm(e) {
				this.default_page_show = false
				switch (e.indexs[0]) {
					case 0:
						this.$u.vuex('vuex_default_page', "/pages/index/index")
						break
					case 1:
						this.$u.vuex('vuex_default_page', "/pages/device/device")
						break
					case 2:
						this.$u.vuex('vuex_default_page', "/pages/history/history")
						break
					case 3:
						this.$u.vuex('vuex_default_page', "/pages/message/message")
						break
					default:
						this.$u.vuex('vuex_default_page', "/pages/index/index")
						break
				}
			},
			default_product_confirm(e) {
				this.$u.vuex('vuex_default_product_index', e.indexs[0])
				this.default_product_show = false
			},
			to_page_my_info() {
				uni.$u.route({
					url: 'pages/my/my_info'
				})
			},
			to_page_my_device() {
				uni.$u.route({
					url: 'pages/my/my_device'
				})
			},
			to_page_my_introduce() {
				uni.$u.route({
					url: 'pages/my/my_introduce'
				})
			},
			to_page_my_money() {
				uni.$u.route({
					url: 'pages/my/my_money'
				})
			},
			to_page_my_privacy() {
				uni.$u.route({
					url: 'pages/my/my_privacy'
				})
			},
			to_page_my_question() {
				uni.$u.route({
					url: 'pages/my/my_question'
				})
			},
			update_confim() {
				if (this.new_version == this.vuex_version) {
					this.update_show = false
				} else {
					this.update_show = false
				}
			},
			serveice_confim() {
				this.service_show = false
			},
			get_update() {
				this.update_show = true
				this.new_version_text = "已更新至最新版本"
				// if (this.new_version == this.vuex_version) {
				// 	this.new_version_text = "已更新至最新版本"
				// } else {
				// 	this.new_version_text = `发现新版本:${this.new_version}`
				// 	this.new_version_confirmText = "立即更新"
				// }
			},
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

	.user-box {
		display: flex;
		padding-bottom: 60rpx;
		padding-top: 50rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		justify-content: space-between;
		align-items: center;

		.user_avatar {
			display: flex;
			justify-content: center;
			flex-grow: 1
		}

		.user_info {
			color: #FFFFFF;
			flex-grow: 4;

			.user_info_name {
				font-size: 40rpx;
			}
		}

		.user_arrow {
			display: flex;
			justify-content: flex-end;
			flex-grow: 1
		}
	}

	.account {
		margin-left: 40rpx;
		margin-right: 40rpx;
		box-shadow: 0px 2px 3px #838383;
		background-color: #f9f9f9;
		padding: 1rpx;

		border: {
			color: #000000;
			width: 1rpx;
			style: solid;
			radius: 20rpx;
		}

		.account_presure {
			background-color: #fdffcd;
			margin-top: 20rpx;

		}

		.account_device {
			background-color: #d3eaff;
			margin-bottom: 30rpx;
		}

		.account_logout {
			background-color: #ffa7a7;
			margin-top: 30rpx;
			margin-bottom: 30rpx;
		}
	}

	.service_link {
		margin-top: 30rpx;
	}

	.version_info {
		font-size: 26rpx;
		color: #888;
	}
</style>
