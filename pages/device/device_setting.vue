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
			<view class="tags">
				<u-tag class="tag_info" v-for="(tag,index) in tags" size="mini" :text="tag.name" :bgColor="tag.color"
					:borderColor="tag.color"></u-tag>
				<u-tag text="管理标签" icon="tags-fill" plain size="mini" color="#888" style="margin-top: 10rpx;"
					@click="tag_modal_show=true"></u-tag>
			</view>
			<u-button class="submit_btn" type="primary" @click="submit">提交</u-button>
		</view>
		<u-overlay :show="tag_modal_show" :mask-click-able="false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<u-divider text="已添加"></u-divider>
					<view class="added_tags">
						<u-tag class="added_tag_info" v-for="(tag,index) in tags" :text="tag.name" :bgColor="tag.color"
							size="mini" :borderColor="tag.color" closable @close="del_tag(tag,index)"></u-tag>
					</view>
					<u-divider text="待添加"></u-divider>
					<view class="tags">
						<u-tag class="tag_info" icon="plus-circle" v-for="(tag,index) in unadded_tags" :text="tag.name"
							size="mini" :bgColor="tag.color" :borderColor="tag.color" @click="add_tag(tag,index)">
						</u-tag>
					</view>
					<u-divider text="自定义标签"></u-divider>
					<view class="new_tag">
						<view class="new_tag_head">
							<text>标签预览 : </text>
							<view class="new_tag_head_btn" :style="{'background-color':buttonColor}">
								{{new_tag_title}}
							</view>
							<!-- <u-tag text="自定义标签" style="margin-left: 10px; width: 75px; text-align: center;"
									:bgColor="buttonColor" :borderColor="buttonColor" size="mini">
								</u-tag> -->
						</view>
						<view class="new_tag_title">
							<text>标签内容 : </text>
							<u--input class="new_tag_title_input" v-model="new_tag_title" clearable></u--input>
						</view>
						<view class="new_tag_color">
							<text>标签颜色 : </text>
							<view class="color_sec" :style="{'background-color':buttonColor}"
								@click="showPickerColor=true"></view>
							<view class="color_sec_btn" @click="add_new_tag">添加标签</view>
						</view>
					</view>
					<button class="tag_btn" type="default" @click="tag_summit">确定</button>
				</view>
			</view>
			<picker-color :isShow="showPickerColor" :bottom="0" @callback='getPickerColor' @tap.stop />
		</u-overlay>
	</view>
</template>

<script>
	import pickerColor from "@/components/helang-pickerColor/helang-pickerColor.vue"
	export default {
		components: {
			"picker-color": pickerColor,
		},
		data() {
			return {
				params: {},
				settings: {
					name: "未知设备",
					period: 5,
					tempL: -40,
					tempU: 40,
					temp_alarm: true,
				},
				tags: [],
				tag_modal_show: false,
				default_tags: [{
					"name": "在线版",
					"color": "#10ac84"
				}, {
					"name": "医疗",
					"color": "#ee5253"
				}, {
					"name": "冷链",
					"color": "#341f97"
				}, {
					"name": "冷链车",
					"color": "#ee5253"
				}, {
					"name": "蓝牙版",
					"color": "#0169b6"
				}, {
					"name": "冷库",
					"color": "#5f27cd"
				}, {
					"name": "集装箱",
					"color": "#862a29"
				}, {
					"name": "果蔬",
					"color": "#cbcb65"
				}, {
					"name": "生鲜",
					"color": "#af4ba2"
				}, {
					"name": "种植",
					"color": "#28a56b"
				}, {
					"name": "车载",
					"color": "#32cf86"
				}, {
					"name": "钓箱",
					"color": "#ff9f43"
				}, {
					"name": "保温箱",
					"color": "#ff5ea7"
				}, {
					"name": "委托运输",
					"color": "#63b826"
				}, {
					"name": "生物箱",
					"color": "#1134ff"
				}, {
					"name": "疫苗",
					"color": "#ff0000"
				}, {
					"name": "海鲜",
					"color": "#ff7a60"
				}, {
					"name": "空运",
					"color": "#d3a0ff"
				}, {
					"name": "户外",
					"color": "#1caca7"
				}, {
					"name": "标本",
					"color": "#980d37"
				}, {
					"name": "超低温",
					"color": "#0d7479"
				}, {
					"name": "药品",
					"color": "#2b9a62"
				}, {
					"name": "校验",
					"color": "#1c6e7f"
				}, {
					"name": "常温",
					"color": "#5cde76"
				}, {
					"name": "冷藏",
					"color": "#001654"
				}, {
					"name": "冷冻",
					"color": "#3e38ff"
				}, {
					"name": "一次性",
					"color": "#3369ff"
				}, {
					"name": "无车承运",
					"color": "#9a9a16"
				}, {
					"name": "可回收",
					"color": "#ff470f"
				}, {
					"name": "奶箱",
					"color": "#8c1286"
				}, {
					"name": "外卖",
					"color": "#d4d054"
				}, {
					"name": "实验室",
					"color": "#7f7937"
				}, {
					"name": "标本",
					"color": "#36210e"
				}, {
					"name": "其它",
					"color": "#222f3e"
				}],
				unadded_tags: [],
				showPickerColor: false,
				bottomPickerColor: 0,
				buttonColor: "#0099FF",
				new_tag_title: "自定义标签",
			};
		},
		async onLoad(options) {
			this.params = options
			this.get_desired()
			this.tags = await this.get_tags(this.params.device_name)
		},
		watch: {
			tags() {
				let temp_list = []
				this.default_tags.forEach(tags => {
					let already_added = false
					this.tags.forEach(addtag => {
						if (addtag.name == tags.name) {
							already_added = true
						}
					})
					if (!already_added) temp_list.push(tags)
				})
				this.unadded_tags = temp_list
			}
		},
		methods: {
			async tag_summit() {
				let tag_txt = `{"tags":${JSON.stringify(this.tags)}}`
				const params = {
					device: this.params.device_name,
					tags: tag_txt
				}
				uni.showToast({
					icon: "loading",
					title: "标签保存中...",
					duration: 2000
				})
				const res = await this.$u.api.set_device_tags({
					params
				})
				if (res.msg == "请求成功!") {
					uni.showToast({
						icon: "success",
						title: "更新完成!",
						duration: 2000
					})
				} else {
					uni.showToast({
						icon: "error",
						title: "更新失败!",
						duration: 2000
					})
				}
				setTimeout(() => {
					this.tag_modal_show = false
				}, 1500)
			},
			strlen(str) {
				var len = 0;
				for (var i = 0; i < str.length; i++) {
					var c = str.charCodeAt(i);
					//单字节加1
					if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
						len++;
					} else {
						len += 2;
					}
				}
				return len;
			},
			add_new_tag() {
				if (this.tags.length < 10) {
					if (this.strlen(this.new_tag_title) > 2 && this.strlen(this.new_tag_title) < 15) {
						let already = false
						this.tags.forEach(device => {
							if (this.new_tag_title == device.name)
								already = true
						})
						if (!already) {
							this.tags.push({
								"name": this.new_tag_title,
								"color": this.buttonColor
							})
						} else {
							uni.showToast({
								title: "标签已添加过",
								icon: "error",
								duration: 3000
							})
						}
						this.buttonColor = "#0099FF"
						this.new_tag_title = "自定义标签"
					} else {
						uni.showToast({
							title: "标签2~7字",
							icon: "error",
							duration: 3000
						})
						this.buttonColor = "#0099FF"
						this.new_tag_title = "自定义标签"
					}
				} else {
					uni.showToast({
						title: "最多10个标签",
						icon: "error",
						duration: 3000
					})
				}
			},
			del_tag(tag, index) {
				this.tags.splice(index, 1)
			},
			add_tag(tag, index) {
				if (this.tags.length < 10) {
					this.tags.push(tag)
				} else {
					uni.showToast({
						title: "最多10个标签",
						icon: "error",
						duration: 3000
					})
				}
			},
			async get_desired() {
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading()
				}, 6000)
				let params = this.params
				const res = await this.$u.api.get_device_desired({
					params
				})
				console.log(res)
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
				if (res2) {
					setTimeout(() => {
						uni.hideLoading();
						this.$u.toast("设置成功! 设备将在下次传输时完成设置!")
					}, 500)
				}
			},
			async get_tags(device) {
				const params = {
					device
				}
				const res = await this.$u.api.get_device_tags({
					params
				})
				return JSON.parse(res.data.tag).tags
			},
			/* 显示获取颜色选择弹窗 */
			showPickerColorPop() {
				this.showPickerColor = true;
			},
			/* 获取颜色选择回调 */
			getPickerColor(color) {
				/* 隐藏弹窗 */
				this.showPickerColor = false;
				/* 判断颜色值是否有效 */
				if (color) {
					this.buttonColor = color;
					console.log('选择的颜色值是：' + color);
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
		bottom: 200rpx;
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
			width: 90%;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 30rpx; //table.height - div_height
		}
	}

	.tags {
		display: flex;
		width: 100%;
		flex-wrap: wrap;

		.tag_info {
			margin-right: 10rpx;
			margin-top: 10rpx;
		}
	}

	.added_tags {
		margin-top: 10rpx;
		display: flex;
		width: 100%;
		flex-wrap: wrap;

		.added_tag_info {
			margin-bottom: -10rpx;
		}
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		border-radius: 20rpx;
		width: 90%;
		height: 90%;
		background-color: #fff;
		padding: 20rpx;
		position: fixed;

		flex-direction: column;

		.tag_btn {
			width: 90%;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 30rpx; //table.height - div_height
		}
	}

	.new_tag {
		.new_tag_head {
			display: flex;
			align-items: center;

			.new_tag_head_btn {
				margin-left: 10px;
				height: 25px;
				border-radius: 4px;
				text-align: center;
				color: #FFFFFF;
				padding-left: 10rpx;
				padding-right: 10rpx;
				line-height: 25px;
				font-size: 12px;
			}
		}

		.new_tag_color {
			display: flex;
			align-items: center;

			.color_sec {
				margin-left: 10px;
				width: 50px;
				height: 50px;
				background-color: #007AFF;
				border-radius: 10rpx;
			}

			.color_sec_btn {
				margin-left: 80px;
				width: 70px;
				height: 30px;
				border-radius: 10rpx;
				text-align: center;
				color: #222;
				line-height: 30px;
				font-size: 12px;
				border: 1px solid #81d7ff;
			}
		}

		.new_tag_title {
			display: flex;
			align-items: center;

			.new_tag_title_input {
				margin: 10px;
				margin-top: 10px;
			}
		}
	}
</style>
