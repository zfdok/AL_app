<template>
	<view class="card_template" @click="handle_click" :style="{'background':statusColor}">
		<view class="card_header">
			<view class="card_title">
				{{device.name}}
			</view>
			<view class="card_subtitle u-line-1">
				设备号: {{device.device_name}}
			</view>
		</view>
		<view class="card_content">
			<view class="card_content_temp">
				<view class="card_content_temp_title">
					温度:
				</view>
				<view class="card_content_temp_value">
					{{device.device_data.temp}}
				</view>
				<view class="card_content_temp_title">
					℃
				</view>
			</view>
			<view class="card_content_humi">
				<view class="card_content_humi_title">
					湿度:
				</view>
				<view class="card_content_humi_value">
					{{device.device_data.humi}}
				</view>
				<view class="card_content_humi_title">
					%RH
				</view>
			</view>
		</view>
		<slot></slot>
		<view class="tags">
			<u-tag class="tag_info" v-for="(tag,index) in device.tags" size="mini"  :text="tag.name" :bgColor="tag.color" :borderColor="tag.color"></u-tag>
		</view>
		
		<view class="card_footer">
			<view class="card_footer_title">
				{{device.timeinfo}}
			</view>
			<view class="card_action">
				<view class="card_action_set" @click.stop="set_settings">
					<u-button text="设置" :color="statusBtnColor" size="mini"></u-button>
				</view>
			</view>
			<view class="card_action_history" @click.stop="to_history_page">
				<u-button text="历史记录" :color="statusBtnColor" size="mini"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "card",
		props: {
			device: {
				type: Object,
				default: () => {
					return {
						device_name: "default",
						name: "未名设备",
						temp: "----",
						humi: "----",
						timeinfo: "设备未激活"
					}
				}
			},
		},
		data() {
			return {
				statusColor: "#cecece",
				statusBtnColor: "#cecece"
			};
		},
		mounted() {
			switch (this.device.status) {
				case 3:
					this.statusColor = "linear-gradient(to right, rgb(255, 135, 147),rgb(235, 184, 255))"
					this.statusBtnColor = "linear-gradient(to right,rgb(170, 59, 70), rgb(154, 103, 0))"
					break
				case 1:
					this.statusColor = "linear-gradient(to right, rgb(236, 236, 236), rgb(185, 185, 185) )"
					this.statusBtnColor = "linear-gradient(to right, rgb(149, 149, 149),rgb(190, 164, 164))"
					break
				case 2:
					this.statusColor = "linear-gradient(to right,rgb(170, 255, 255) ,rgb(170, 255, 165) )"
					this.statusBtnColor = "linear-gradient(to right, rgb(73, 75, 181),rgb(0, 170, 127))"
					break
				default:
					break
			}

		},
		methods: {
			handle_click() {
				this.$emit('card_click', 1)
			},
			async set_settings() {
				let user = this.vuex_user.name
				let type = this.vuex_product_list[this.vuex_product_index].type
				let device_name = this.device.device_name
				let name = this.device.name
				let product_id = this.device.product_id
				const params = {
					user,
					type,
					device_name,
					name,
					product_id
				}
				uni.$u.route({
					url: 'pages/device/device_setting',
					params
				})
			},
			async to_history_page() {
				let user = this.vuex_user.name
				let type = this.vuex_product_list[this.vuex_product_index].type
				let device_name = this.device.device_name
				let name = this.device.name
				let product_id = this.device.product_id
				const params = {
					user,
					type,
					device_name,
					name,
					product_id
				}
				uni.$u.route({
					url: 'pages/history/history',
					params
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.card_template {
		margin: 20rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		padding: 16rpx;
		box-shadow: 2px 2px 3px #4c4c4c;

		border: {
			radius: 20rpx;
		}
		.tags{
			display: flex;
			flex-wrap: wrap;
			.tag_info{
				margin-right: 4rpx;
				margin-bottom: 8rpx;
			}
		}
		.card_header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card_title {
				font: {
					size: 35rpx;
					weight: 700;
				}

				color: #333333;
			}

			.card_subtitle {
				font: {
					size: 26rpx;
					weight: 300;
				}

				color: #7f7f00;
			}
		}

		.card_content {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card_content_temp {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.card_content_temp_title {
					padding-bottom: 10rpx;
					font-size: 25rpx;
				}

				.card_content_temp_value {
					font-size: 75rpx;
					color: #31527d;
					font-weight: 700;
					// #31527d;
				}
			}

			.card_content_humi {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.card_content_humi_title {
					font-size: 25rpx;
					margin-bottom: -6rpx;
				}

				.card_content_humi_value {
					font-size: 60rpx;
					font-weight: 700;
					margin-bottom: -16rpx;
					color: #33674b;
				}
			}
		}

		.card_footer {
			display: flex;
			// justify-content: space-between;
			align-items: center;

			.card_footer_title {

				flex-grow: 2;

				font: {
					size: 26rpx;
				}

				;
				color:#888
			}

			.card_action {
				flex-grow: 1;
				// display: flex;
				// justify-content: flex-end;
				// align-items: center;
				// padding-top: 10rpx;

				.card_action_set {
					margin-left: 200rpx;
					margin-right: 10rpx;
				}

				.card_action_history {
					margin-left: 10rpx;
				}
			}
		}

	}
</style>
