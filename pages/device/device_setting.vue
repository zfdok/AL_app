<template>
	<view class="content">
		<view class="setting_card">
			<view class="setting_card_title">
				设置
			</view>
			<u--form labelPosition="left" labelWidth=80 :model="settings" ref="form1">
				<u-form-item label="设备名:" prop="settings.name" borderBottom ref="item1">
					<u--input v-model="settings.name" border="none"></u--input>
				</u-form-item>
				<u-form-item label="采集周期:" prop="settings.period" borderBottom ref="item1">
					<u--input v-model="settings.period" border="none"></u--input>
				</u-form-item>
				<u-form-item label="报警开关:" prop="settings.temp_alarm" borderBottom ref="item1">
					<u-switch v-model="settings.temp_alarm" activeColor="#2980b9"></u-switch>
				</u-form-item>
				<u-form-item label="温度上限:" prop="settings.tempU" borderBottom ref="item1">
					<u--input v-model="settings.tempU" border="none"></u--input>
				</u-form-item>
				<u-form-item label="温度下限:" prop="settings.tempL" borderBottom ref="item1">
					<u--input v-model="settings.tempL" border="none"></u--input>
				</u-form-item>
			</u--form>
			<u-button class="submit_btn" type="primary" @click="submit">提交</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {},
				settings: {},
			};
		},
		onLoad(options) {
			this.params = options
			this.get_desired()
		},
		methods: {
			async get_desired() {
				uni.showLoading({
					title: '加载中...',
				});
				let params = this.params
				const res = await this.$u.api.get_device_desired({
					params
				})
				this.settings = {
					name: this.params.name,
					period: res.data.period.value,
					tempL: res.data.tempL.value,
					tempU: res.data.tempU.value,
					temp_alarm: res.data.temp_alarm.value
				}
				setTimeout(() => {
					uni.hideLoading();
				}, 500)
			},
			async submit() {
				uni.showLoading({
					title: '加载中...',
				});
				this.params.name = this.settings.name
				let params = this.params
				let res = await this.$u.api.set_device_name({
					params
				})
				let params2 = this.params
				params2.name = this.settings.name
				params2.temp_alarm = this.settings.temp_alarm
				params2.tempU = this.settings.tempU
				params2.tempL = this.settings.tempL
				params2.period = this.settings.period
				let res2 = await this.$u.api.set_device_desired({
					params: params2
				})
				if (res2){
					setTimeout(() => {
						uni.hideLoading();
						this.$u.toast("设置成功! 设备将在下次传输时完成设置!")
					}, 500)
				}
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
</style>
