<template>
	<view class="container">
		<u-sticky offsetTop=10>
			<u-sticky offsetTop=-36>
				<view class="content_header">
					<view class="select_mode">
						<view class="select_mode_title">
							选择模式
						</view>
						<u-subsection :list="list" mode="subsection" @change="sectionChange" :current="curNow">
						</u-subsection>
					</view>
				</view>
			</u-sticky>
		</u-sticky>

		<view v-if="curNow == 0">
			<view class="charts-box">
				<qiun-data-charts type="area" :chartData="temp_chartdata" :disableScroll="true" background="none"
					:tapLegend="false" :ontouch="true" />
			</view>
		</view>
		<view v-if="curNow == 1">
			<view class="charts-box">
				<qiun-data-charts type="area" :chartData="humi_chartdata" :disableScroll="true" background="none"
					:tapLegend="false" :ontouch="true" />
			</view>
		</view>
		<view v-if="curNow == 2">
			<view class="map_content">
				<map id="maps" style="width: 100%;height: 100%;"
					:latitude="polyline[0].points[0]?polyline[0].points[0].latitude:39.90" scale=12
					:longitude="polyline[0].points[0]?polyline[0].points[0].longitude:116.39" :polyline="polyline"
					:markers="markers"></map>
			</view>
		</view>
		<view v-if="curNow == 3">
			<view class="cur_content">
				<u-list>
					<u-list-item class="cur_content_box" v-for="(data, index) in datas_show" :key="index">
						<u-tag :text="data.timestamp"></u-tag>
						<view class="">
							<view class="cur_content_box1">
								<text class="cur_content_box_temp">{{data.temp}}℃</text>
								<text class="cur_content_box_humi">{{data.humi}}%R/H </text>
								<text class="cur_content_box_pos">经纬度 : {{data.le}}, {{data.ln}}</text>
							</view>
						</view>
					</u-list-item>
					<u-list-item class="cur_content_footer">
						已无更多数据
					</u-list-item>
				</u-list>
			</view>
		</view>
		<view class="tools" v-show="curNow ==0 || curNow ==1 || curNow ==3"
			:class="(curNow ==0 || curNow ==1 )?'item_routed':''">
			<view class="tools_btn">
				<u-button type="success" mini shape="circle" @click="lastPage" :disabled="!pageup_btn_enabled"
					class="btn1">←
				</u-button>
				<u-button type="success" mini shape="circle" @click="nextPage" :disabled="!pagedown_btn_enabled"
					class="btn2">→
				</u-button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: ['温度', '湿度', '地图', '数据'],
				curNow: 0,
				rec: {},
				datas: [],
				datas_reverse: [],
				datas_show: [],
				page_index: 0,
				temp_chartdata: {
					categories: [],
					series: [{
						name: "温度",
						data: []
					}]
				},
				humi_chartdata: {
					categories: [],
					series: [{
						name: "湿度",
						data: []
					}]
				},
				polyline: [{ //指定一系列坐标点，从数组第一项连线至最后一项
					points: [{
							latitude: 39.909,
							longitude: 116.39742
						},
						{
							latitude: 39.90,
							longitude: 116.39
						},
					],
					color: "#0000cf", //线的颜色
					width: 16, //线的宽度
					dottedLine: true, //是否虚线
					arrowLine: true, //带箭头的线 开发者工具暂不支持该属性
				}],
				markers: [],
				pageup_btn_enabled: false,
				pagedown_btn_enabled: true,
			};
		},
		onLoad(options) {
			this.rec = options
			this.get_device_history()
			// console.log(this.rec.tempU)
			// console.log(this.rec.tempL)
		},
		watch: {
			datas() {
				this.polyline[0].points = []

				let location_series = []
				this.datas.forEach((data) => {
					location_series.push({
						latitude: data.ln,
						longitude: data.le,
						// timespan: data.timestamp
					})
				})

				this.polyline[0].points = location_series

				if (this.polyline[0]) {
					let pot = this.polyline[0]
					this.markers.push({
						latitude: this.polyline[0].points[0].latitude, //纬度
						longitude: this.polyline[0].points[0].longitude, //经度
						iconPath: '/static/device_location.png', //显示的图标 
						callout: {
							display: 'ALWAYS',
							content: `🚩始`,
						}
					})
				}

				if (this.polyline[0].points[this.polyline[0].points.length - 1]) {
					let pot = this.polyline[0].points[this.polyline[0].points.length - 1]
					this.markers.push({
						latitude: pot.latitude, //纬度
						longitude: pot.longitude, //经度
						iconPath: '/static/device_location_ol.png', //显示的图标 
						callout: {
							display: 'ALWAYS',
							content: `🚩终`,
						}
					})

				}
			},
			datas_reverse() {
				this.page_index = 0
				this.datas_show = this.datas_reverse.slice(this.page_index * 120, this.page_index * 120 + 120)
				if (this.page_index + 120 > this.datas_reverse.length) {
					this.pagedown_btn_enabled = false
				} else {
					this.pagedown_btn_enabled = true
				}
			},
			datas_show() {
				this.temp_chartdata.categories = []
				this.humi_chartdata.categories = []
				this.temp_chartdata.series[0].data = []
				this.humi_chartdata.series[0].data = []

				let categories = []
				let temp_series = []
				let humi_series = []

				this.datas_show.forEach((data) => {
					categories.push(data.timestamp)
					temp_series.push(data.temp)
					humi_series.push(data.humi)
				})
				this.temp_chartdata.categories = categories
				this.humi_chartdata.categories = categories
				this.temp_chartdata.series[0].data = temp_series
				this.humi_chartdata.series[0].data = humi_series
			},
			page_index() {
				if (this.page_index <= 0) {
					this.pageup_btn_enabled = false
				} else {
					this.pageup_btn_enabled = true
				}
				if (this.page_index + 120 > this.datas_reverse.length) {
					this.pagedown_btn_enabled = false
				} else {
					this.pagedown_btn_enabled = true
				}
			},
			curNow() {
				if (this.curNow == 3)
					this.page_index = 0
			}
		},
		onNavigationBarButtonTap(v) {
			if (v.index == 1) {
				uni.$u.route({
					url: 'pages/history/history_pdf',
					params: {
						datas: JSON.stringify(this.datas),
						rec: JSON.stringify(this.rec)
					}
				})
			} else if (v.index == 0) {
				uni.$u.route({
					url: 'pages/printer/printer',
					params: {
						datas: JSON.stringify(this.datas),
						rec: JSON.stringify(this.rec)
					}
				})
			}
		},
		methods: {
			//节点切换
			sectionChange(index) {
				this.curNow = index;
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 1000)
			},
			// 获取设备历史数据
			async get_device_history() {
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 6000)
				let params = {
					type: this.rec.type,
					device: this.rec.device_name,
					id: this.rec.rec_id,
					start_time: this.rec.start_time,
					last_time: this.rec.last_time,
				}
				let res = await this.$u.api.get_device_history({
					params
				})
				this.datas = res.data
				this.datas_reverse = JSON.parse(JSON.stringify(res.data)).reverse()
				if (res) {
					setTimeout(() => {
						uni.hideLoading();
					}, 500)
				}
			},
			// 最后一页
			lastPage() {
				if ((this.page_index - 1) * 120 >= 0) {
					uni.showToast({
						icon: "loading",
						duration: 1500
					})
					this.page_index--
					this.datas_show = this.datas_reverse.slice(this.page_index * 120, this.page_index * 120 + 120)
				} else {
					this.pageup_btn_enabled = false
					this.page_index = 0
				}
			},
			// 下一页
			nextPage() {
				if ((this.page_index + 1) * 120 <= this.datas_reverse.length) {
					uni.showToast({
						icon: "loading",
						duration: 1500
					})
					this.page_index++
					this.datas_show = this.datas_reverse.slice(this.page_index * 120, this.page_index * 120 + 120)
				} else {
					this.pagedown_btn_enabled = false
				}
			},
		}
	}
</script>

<style lang="scss">
	.container {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
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

	.charts-box {
		// transform:rotate(90deg);
		position: absolute;
		margin-top: 40px;
		left: 5px;
		right: 5px;
		top: 50px;
		bottom: 10px;
		// width: 100%;
		// height: 600px;
	}

	.map_content {
		margin-top: 100rpx;
		width: 100%;
		height: 650px;
		background-color: #2979FF;
	}

	.cur_content {
		margin-top: 80rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
	}

	.cur_content_box {
		box-shadow: 1px 1px 2px #888888;
		margin-bottom: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx;
	}

	.cur_content_box1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cur_content_footer {
		text-align: center;
		margin-bottom: 100rpx;
		padding-bottom: 100rpx;
	}

	.cur_content_box_temp {
		font-size: 28rpx;
		color: #00557f;
		padding-left: 20rpx;
	}

	.cur_content_box_humi {
		font-size: 28rpx;
		color: #468c3b;
	}

	.cur_content_box_pos {
		font-size: 24rpx;
		color: #717171;
		padding-right: 20rpx;
	}

	.tools {
		position: absolute;
		width: 85px;
		right: 5px;
		bottom: 50px;
		opacity: 0.92;

		.tools_btn {
			display: flex;

			.btn1 {
				margin-right: 5px;
			}
		}
	}

	.item_routed {
		transform: rotate(90deg);
	}

	.printer {
		.btn1 {}

		.btn2 {}
	}
</style>
