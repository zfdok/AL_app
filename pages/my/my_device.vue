<template>
	<view>
		<view v-for="(device,index) in devices" :key="index">
			<view class="device_card">
				<view class="device_title">
					<view class="device_card_title">
						{{device.name}}
					</view>
					<view class="device_card_sub_title">
						设备编号:{{device.device_name}}
					</view>
				</view>
				<view class="device_content">
					<view class="device_card_content">
						设备剩余有效期:
						<view class="device_card_content_day">
							<u--text bold block size=18 :text="device.day_left"
								:color="device.day_left<=30?'#ee0000':'#007f00'"></u--text>
						</view>
						天
					</view>
					<view class="device_card_content_btn">
						<u-button type="primary" icon="shopping-cart" :color="device.day_left<=30?'#b93d00':'#feba92'"
							@click="btn_charge">购买服务期
						</u-button>
					</view>
				</view>
			</view>
		</view>
		<u-modal :show="charge_show" title="请联系客服" @confirm="charge_show=false">
			<view class="slot-content ">
				<u-avatar shape="square" size=250 src='https://img.anlengyun.com/my_wechat.jpg'></u-avatar>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: [],
				charge_show: false
			};
		},
		onShow() {
			uni.showToast({
				title: '加载中...',
				duration:1000,
				icon:'loading'
			})
			this.get_userdeviceinfo()
		},
		methods: {
			async get_userdeviceinfo() {
				console.log("get_userdeviceinfo")
				let params = {
					username: this.vuex_user.name
				}

				let res = await this.$u.api.get_user_device_info({
					params
				})
				let devices = res.data
				let user = this.vuex_user.name

				await devices.forEach(async (device, index) => {
					let type = device.product_id
					// 更新设备名
					let device_name = device.device_name
					const params = {
						user,
						type,
						device_name
					}
					const res = await this.$u.api.get_device({
						params
					})
					device.name = res.data.desc == "" ? "未名设备" : res.data.desc
					this.devices.push(device)
				})
			},
			btn_charge() {
				this.charge_show = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.device_card {
		margin-top: 15rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		margin-bottom: 15rpx;
		background-color: #f1ac7e;
		padding: 20rpx;

		border: {
			radius: 10rpx;
		}

		;

		.device_title {
			display: flex;
			width: 100%;
			justify-content: space-between;

			.device_card_title {
				color: #565a55;

				font: {
					size: 40rpx;
				}
			}

			.device_card_sub_title {
				color: #565a55;

				font: {
					size: 22rpx;
				}
			}
		}

		.device_card_content {
			color: #866718;
			display: flex;
			align-items: flex-end;

			font: {
				size: 26rpx;
			}

			// .device_card_content_day {
			// 	display: inline;
			// 	color: #aa0000;

			// 	font: {
			// 		size: 36rpx;
			// 		weight: 800;
			// 	}
			// }
		}

		.device_card_content_btn {
			margin-top: 10rpx;
		}
	}
</style>
