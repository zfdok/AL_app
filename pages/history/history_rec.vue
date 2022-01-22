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
					<u-list-item class="cur_content_box" v-for="(data, index) in datas" :key="index">
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
				markers: []
			};
		},
		onLoad(options) {
			this.rec = options
			this.get_device_history()
		},
		watch: {
			datas() {
				this.temp_chartdata.categories = []
				this.humi_chartdata.categories = []
				this.temp_chartdata.series[0].data = []
				this.humi_chartdata.series[0].data = []
				this.polyline[0].points = []

				let categories = []
				let temp_series = []
				let humi_series = []
				let location_series = []
				this.datas.forEach((data) => {
					categories.push(data.timestamp)
					temp_series.push(data.temp)
					humi_series.push(data.humi)
					location_series.push({
						latitude: data.ln,
						longitude: data.le,
						// timespan: data.timestamp
					})
				})
				this.temp_chartdata.categories = categories
				this.humi_chartdata.categories = categories
				this.temp_chartdata.series[0].data = temp_series
				this.humi_chartdata.series[0].data = humi_series
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
			}
		},

		methods: {
			sectionChange(index) {
				this.curNow = index;
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 1000)
			},
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
				if (res) {
					setTimeout(() => {
						uni.hideLoading();
					}, 500)
				}
			}
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
		margin-top: 40px;
		width: 100%;
		height: 400px;
	}

	.map_content {
		margin-top: 100rpx;
		width: 100%;
		height: 600px;
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
</style>
