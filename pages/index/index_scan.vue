<template>
	<view class="content">
		<view class="title">
			{{info}}
		</view>
		<u-avatar class="success_img" v-if="success_flag" icon="checkbox-mark" size="80" fontSize="52"
			bg-color="#83e065"></u-avatar>
		<u-loading-icon :show="loading" mode="circle" size="60" color="green"></u-loading-icon>
		<view class="btns" v-if="success_flag">
			<u-button type="success" size="large" @click="btn_ok">绑定完成</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: {},
				loading: true,
				icon: "",
				info: "加载中...",
				success_flag: false
			};
		},
		async onLoad(option) {
			if (option.type == "CODE_128") {
				this.code = option
				let bind_to_p = await this.device_binded_to_project()
				if (bind_to_p) {
					setTimeout(() => {
						this.device_binded_to_group()
					}, 1000)
				} else {
					setTimeout(() => {
						uni.navigateBack({})
					}, 2000)
				}
			}
		},
		methods: {
			btn_back() {
				uni.navigateBack({})
			},
			btn_ok() {
				uni.navigateBack({})
			},
			async check_binded() {
				uni.showLoading({
					title: "检测设备绑定情况"
				})
				let params = {
					device: this.code.value
					// device: "al00014g0001"
				}
				let res = await this.$u.api.check_device_binded({
					params
				})
				uni.hideLoading()
				if (res.data.success == 1) {
					uni.showToast({
						icon: "success",
						title: "设备可被绑定"
					})
				} else {
					uni.showToast({
						icon: "error",
						title: "设备已经被绑定"
					})
				}
				return res.data.success
			},
			async device_binded_to_project() {
				uni.showLoading({
					title: "添加设备至项目"
				})
				this.info = "添加设备至项目"
				let type = this.code.value.slice(6, 8);
				if (type == "4g") type = "zx"
				let params = {
					device: this.code.value,
					type
				}
				let res = await this.$u.api.bind_device_to_project({
					params
				})
				uni.hideLoading()
				if (res.data.success == 1) {
					uni.showToast({
						icon: "success",
						title: "成功添加至项目"
					})
					this.info = "成功添加至项目"
				} else {
					if (res.data.msg == "此设备已处于项目中，不能进行添加操作") {
						uni.showToast({
							icon: "error",
							title: "设备已在项目中",
							duration:2000
						})
						this.info = "此设备已处于项目中，不能进行添加操作!"
					} else {
						uni.showToast({
							icon: "error",
							title: "设备不存在!"
						})
						this.info = '设备不存在!\n请扫码正确的设备码!'
					}
				}
				return res.data.success
			},
			async device_binded_to_group() {
				uni.showLoading({
					title: "绑定用户设备"
				})
				this.info = '绑定用户设备中...'
				let type = this.code.value.slice(6, 8);
				if (type == "4g") type = "zx"
				let params = {
					device: this.code.value,
					user: this.vuex_user.name,
					type
				}
				let res = await this.$u.api.bind_device_to_group({
					params
				})
				uni.hideLoading()
				if (res.data.success == 1) {
					this.info = '设备绑定成功!'
					this.loading = false
					this.success_flag = true
				} else {
					if (res.data.msg == "该设备已存在分组中") {
						uni.showToast({
							icon: "error",
							title: "设备已被绑定!"
						})
						this.info = '设备已被绑定!'
					} else {
						uni.showToast({
							icon: "error",
							title: "设备绑定失败"
						})
						this.info = '设备绑定失败!\n请重试!'
					}
				}
				return res.data.success
			}
		}
	}
</script>

<style lang="scss">
	.title {
		text-align: center;
		font-size: 40rpx;
		font-weight: bold;
		margin-top: 150rpx;
		margin-bottom: 200rpx;
		color: #366092;
	}

	.success_img {
		margin: 0 auto;
		width: 8rem;
		padding: 1rem;
		color: #fff;
		background: #000;
		display: flex;
		align-items: center;
	}

	.btns {
		width: 90%;
		padding: 5%;
		align-items: center;
		position: absolute;
		bottom: 20%;

		.btns__btn {
			margin-bottom: 40rpx;
		}
	}
</style>
