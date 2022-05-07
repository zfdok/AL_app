<template>
	<view class="container">
		<image class="bg-set" src="/static/myback.png"></image>
		<u-sticky offsetTop=0>
			<u-icon name="reload" class="index_avatar" color="#f1f1f1" size="32" @click="navigationFlashTap"></u-icon>
			<image class="sticky_top" src="/static/myback2.png"></image>
		</u-sticky>
		<u-sticky offsetTop=80>
			<u-sticky offsetTop=-36>
				<view class="content_header">
					<view class="select_mode">
						<view class="select_mode_title">
							{{vuex_product_list[vuex_product_index].fullname}} 🟢在线:{{devices_online.length}}
							🔴离线:{{devices_offline.length}} ⚫未激活:{{devices_unactive.length}}
						</view>
						<u-subsection :list="list" mode="subsection" :activeColor="bg_s[curNow]" :fontSize="14"
							:current="curNow" @change="sectionChange"></u-subsection>
					</view>
				</view>
			</u-sticky>
		</u-sticky>
		<view class="content">
			<view v-if="curNow == 0">
				<view v-for="(device_online,index) in devices_online" :key="'online-'+index">
					<card @card_click="to_detial_page(index)" :device="device_online">
						<view class="transition" v-if="select_index == index && curNow == 0">
							<map :latitude="device_online.ln" :longitude="device_online.le"
								:markers="device_online.markers" style="width: 100%; height: 310px;"></map>
						</view>
					</card>
				</view>
				<u-empty :show="devices_online.length==0"
					icon="https://img.anlengyun.com/anlengAPP/empty02.png" text="无在线设备" textColor="#333" textSize="16"
					width="200" height="200" marginTop="80">
				</u-empty>
			</view>
			<view v-if="curNow == 1">
				<view v-for="(device_offline,index) in devices_offline" :key="'offline-'+index">
					<card @card_click="to_detial_page(index)" :device="device_offline">
						<view class="map_box" v-if="select_index == index && curNow == 1">
							<map :latitude="device_offline.ln" :longitude="device_offline.le"
								:markers="device_offline.markers" style="width: 100%; height: 310px;"></map>
						</view>
					</card>
				</view>
				<u-empty :show="devices_offline.length==0"
					icon="https://img.anlengyun.com/anlengAPP/empty02.png" text="无离线设备" textColor="#333" textSize="16"
					width="200" height="200" marginTop="80">
				</u-empty>
			</view>
			<view v-if="curNow == 2">
				<view v-for="(device_unactive,index) in devices_unactive" :key="'unactive-'+index">
					<card @card_click="to_detial_page(index)" :device="device_unactive">
					</card>
				</view>
				<u-empty :show="devices_unactive.length==0"
					icon="https://img.anlengyun.com/anlengAPP/empty02.png" text="无未激活设备" textColor="#333" textSize="16"
					width="200" height="200" marginTop="80">
				</u-empty>
			</view>
			<view v-if="curNow == 3">
				<view v-for="(device_online,index) in devices_online" :key="'online-'+index">
					<card @card_click="to_detial_page(index)" :device="device_online">
					</card>
				</view>
				<view v-for="(device_offline,index) in devices_offline" :key="'offline-'+index">
					<card @card_click="to_detial_page(index)" :device="device_offline">
					</card>
				</view>
				<view v-for="(device_unactive,index) in devices_unactive" :key="'unactive-'+index">
				</view>
				<u-empty :show="devices.length==0"
					icon="https://img.anlengyun.com/anlengAPP/empty02.png" text="无设备" textColor="#333" textSize="16"
					width="200" height="200" marginTop="80">
				</u-empty>
			</view>
		</view>
	</view>

</template>

<script>
	let time_d;
	export default {
		data() {
			return {
				curNow: 0,
				select_index: 10000,
				bg_s: ["#55aa7f", "#f56c6c", "#adadad"],
				list: ['在线', '离线', '未激活', '全部'],
				devices: [],
				devices_online: [],
				devices_offline: [],
				devices_unactive: [],
				show: false
			}
		},
		watch: {
			// 获取设备列表后更新设备基本信息和最新信息
			async devices() {

			}
		},
		onLoad() {
			if (!this.$u.utils.isLogin()) return
			clearInterval(time_d)
			time_d = setInterval(() => {
				let pages = getCurrentPages();
				let curPage = pages[pages.length - 1].route;
				if (curPage == 'pages/device/device') {
					this.get_device()
				}
			}, 60000)

		},
		onShow() {
			this.get_device()
		},
		methods: {
			async get_tags(device) {
				const params = {
					device
				}
				const res = await this.$u.api.get_device_tags({
					params
				})
				return JSON.parse(res.data.tag).tags
			},
			to_detial_page(index) {
				this.select_index = this.select_index == index ? 10000 : index
			},
			// 获取设备清单
			async get_device() {
				uni.showLoading({
					title: '加载中...',
				});
				let user = this.vuex_user.name
				let type = this.vuex_product_list[this.vuex_product_index].type
				const params = {
					user,
					type
				}
				const res = await this.$u.api.get_user_devicelist_by_type({
					params
				})
				this.devices = res.data.list
				uni.hideLoading();
				//--------------------------------------------------
				let devices_online = []
				let devices_offline = []
				let devices_unactive = []

				for (let i = 0; i < this.devices.length; i++) {
					let now_date = new Date();
					let last_time = new Date(this.devices[i].last_time);
					// 更新设备名
					let device_name = this.devices[i].device_name
					const params = {
						user,
						type,
						device_name
					}
					const res = await this.$u.api.get_device({
						params
					})
					this.devices[i].name = res.data.desc == "" ? "未名设备" : res.data.desc
					//更新设备最后上传时间
					if (this.devices[i].status == 1) {
						this.devices[i].timeinfo = "设备未激活"
						this.devices[i].device_data = {
							temp: "-.--",
							humi: "-.--",
							le: 0,
							ln: 0,
							start_time: "--.--",
							last_time: "--.--",
						}
						devices_unactive.push(this.devices[i])
					} else {
						this.devices[i].timeinfo =
							`${new Date(this.devices[i].last_time).format("yyyy/MM/dd hh:mm:ss")}`
						//更新设备温湿度信息
						const res2 = await this.$u.api.get_device_latest({
							params
						})
						let device_data = {}
						res2.data.list.forEach((data) => {
							switch (data.identifier) {
								case "temp":
									device_data.temp = data.value
									break
								case "humi":
									device_data.humi = data.value
									break
								case "le":
									device_data.le = data.value
									break
								case "ln":
									device_data.ln = data.value
									break
								case "start_time":
									device_data.start_time = data.value
									break
								case "last_time":
									device_data.last_time = data.value
									break
							}
						})
						this.devices[i].device_data = device_data
						// 更新设备位置信息
						const res3 = await this.$u.api.get_device_latest_lbs({
							params
						})
						if (JSON.stringify(res3.data) == "{}") {
							this.devices[i].le = 116.39747
							this.devices[i].ln = 39.9080
						} else {
							this.devices[i].le = res3.data.lon != "" ? res3.data.lon : 0
							this.devices[i].ln = res3.data.lat != "" ? res3.data.lat : 0
						}
						this.devices[i].markers = [{
							latitude: this.devices[i].ln, //纬度
							longitude: this.devices[i].le, //经度
							iconPath: '/static/device_location.png', //显示的图标 
							callout: {
								display: 'ALWAYS',
								content: `🚩当前位置:\n🌏东经${this.devices[i].le.toFixed(2)},🌏北纬${this.devices[i].ln.toFixed(2)}`,
							}

						}]

						// 更新标签
						let res4 = await this.get_tags(this.devices[i].device_name)
						this.devices[i].tags = res4

						//根据设备状态分类
						if (this.devices[i].status == 2 || now_date - last_time < 420000) {
							this.devices[i].status = 2
							devices_online.push(this.devices[i])
						} else if (this.devices[i].status == 3) {
							devices_offline.push(this.devices[i])
						}
					}
				}
				let devices_names = []
				devices_online.forEach(device => {
					devices_names.push(device.device_name)
				})
				let devices_online_sorted = []
				devices_names = devices_names.sort(function(a, b) {
					return a.localeCompare(b)
				})
				for (let i = 0; i < devices_names.length; i++) {
					devices_online.forEach(device => {
						if (device.device_name == devices_names[i]) {
							devices_online_sorted.push(device)
						}
					})
				}
				this.devices_online = devices_online_sorted
				this.devices_offline = devices_offline
				this.devices_unactive = devices_unactive
				return true
			},
			async navigationFlashTap() {
				let res = await this.get_device()
				if (res === true) {
					setTimeout(() => {
						uni.hideNavigationBarLoading()
					}, 500)
				}
			},
			sectionChange(index) {
				this.curNow = index;
				this.select_index = 10000
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.index_avatar {
		position: absolute;
		z-index: 6;
		margin-top: 80rpx;
		margin-left: 40rpx;
	}

	.sticky_top {
		width: 100%;
		height: 260rpx;
		z-index: -1;
	}


	.content_header {
		margin-top: -40rpx;

		.select_mode {
			box-shadow: 2px 2px 3px #4c4c4c;
			margin-bottom: 10rpx;
			margin-left: 40rpx;
			margin-right: 40rpx;
			padding: 20rpx;
			height: 105rpx;
			background-color: rgba(250, 250, 250, 0.95);
			z-index: 2;

			border: {
				radius: 20rpx;
			}

			.select_mode_title {
				height: 50rpx;
				font-size: 24rpx;
				text-align: center;
			}
		}
	}

	.map_box {
		margin: 2px;
		z-index: -1;
		display: inline;

		border: {
			// color: #000000; //上面2条可以写成这样
			// width: 1rpx;
			// style: solid;
			radius: 10rpx;
		}

		.map_box_map {
			z-index: -1;
			display: inline;
		}
	}
</style>
