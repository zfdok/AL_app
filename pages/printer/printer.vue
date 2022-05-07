<template>
	<view>
		<view class="content">
			<u-button type="primary" @click="OpenBluetooth" text="蓝牙扫描" size="large" :loading="loading?true:false">
			</u-button>
			<view v-show="devices.length>0?true:false" class="devices_list">
				<view class="text-red">扫描设备</view>
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in devices" :key="index">
						<view>
							<radio :value="item.deviceId" />{{item.name}}({{item.deviceId}})
						</view>
					</label>
				</radio-group>
			</view>
			<u-button type="primary" :disabled="select_characteristicId==''?true:false"
				@click="writeBLECharacteristicValue_brief" text="打印监测分析简报" size="large"></u-button>
			<u-button type="primary" :disabled="select_characteristicId==''?true:false"
				@click="writeBLECharacteristicValue_sample" text="打印监测采样报告" size="large"></u-button>
			<u-button type="primary" :disabled="select_characteristicId==''?true:false"
				@click="xiangqing_alarm_show = true" text="打印监测数据详情报告" size="large" :loading="xiangdan_loading">
			</u-button>
		</view>
		<!-- <view class="text-red">设备服务列表</view>
		<radio-group @change="radioChange2">
			<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in serverList" :key="index">
				<view>
					<radio :value="item.uuid" />{{item.uuid}}
				</view>
			</label>
		</radio-group> -->
		<u-modal :show="xiangqing_alarm_show" title="警告" @confirm="writeBLECharacteristicValue" closeOnClickOverlay  confirmText="仍旧打印详单" cancelText="取消打印" showCancelButton
			@close="xiangqing_alarm_show=false" @cancel="xiangqing_alarm_show=false">
			<view class="slot-content">
				<rich-text class="version_info" :nodes="`注意: 当前记录包含:${this.datas.length}条数据, 预计耗费打印纸${(4*this.datas.length+140)/10}厘米,耗时${14+this.print_datas.length*12}秒`"></rich-text>
				<rich-text style="color: #FF0000;" nodes="强烈不建议您使用热敏打印机打印!!!"></rich-text>
				<!-- <rich-text v-else class="version_info"  style="color: #DD524D;" nodes="注意: 请确认您安装了足够的热敏纸"></rich-text> -->
				<rich-text class="version_info"  style="color: #00a550;"  nodes="注意: 您可以在 安冷云WEB端→数据中心→验证报告 功能中更方便的生成PDF报告并打印"></rich-text>
				<u-link class="service_link"  href="https://anlengyun.com/" text="安冷云WEB端官网: anlengyun.com"></u-link>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import PrinterJobs from './printerjobs.js'
	import printerUtil from './printerutil.js'
	export default {
		data() {
			return {
				devices: [],
				select_device: "",
				select_service: "",
				select_characteristicId: "",
				ServiceUUID: "",
				serverList: [],
				datas: [],
				print_datas: [],
				danger_datas: [],
				sample_datas: [],
				rec: {},
				tempUA: 0,
				tempLA: 0,
				print_time: "",
				loading: false,
				xiangdan_loading: false,
				xiangqing_alarm_show :false
			};
		},
		onLoad(options) {
			this.datas = JSON.parse(options.datas)
			this.rec = JSON.parse(options.rec)
			var date = new Date();
			this.print_time = this.getTime()
			this.handle_datas()
		},
		methods: {
			handle_datas() {
				uni.showToast({
					title: "整理数据中",
					duration: 3000,
					icon: "loading"
				})
				this.danger_datas = [];
				this.print_datas = [];
				this.sample_datas = [];
				this.tempUA = 0;
				this.tempLA = 0;
				let temp_list = []
				for (var i = 0; i < this.datas.length / 30; i++) {
					temp_list.push(this.datas.slice(i * 30, i * 30 + 30))
				}

				temp_list.forEach(data_list => {
					var print_list = []
					data_list.forEach(data => {
						let print_data = {
							time: data.timestamp,
							temp: data.temp.toFixed(2)
						}
						print_list.push(print_data)
					});
					this.print_datas.push(print_list)
				})
				//////////////////////////////////////////
				if (this.datas.length > 25) {
					this.datas.forEach((data, index) => {
						let print_data = {
							time: data.timestamp,
							temp: data.temp.toFixed(2)
						}
						if (data.temp > this.rec.tempU) {
							this.danger_datas.push(print_data)
							this.tempUA++;
						} else if (data.temp < this.rec.tempL) {
							this.danger_datas.push(print_data)
							this.tempLA++;
						} else if (index == 0 || index == this.datas.length - 1 || index % (parseInt(this.datas
								.length / 25)) == 0) {
							this.sample_datas.push(print_data)
						}

					})
				} else {
					this.datas.forEach((data, index) => {
						let print_data = {
							time: data.timestamp,
							temp: data.temp.toFixed(2)
						}
						this.sample_datas.push(print_data)
						if (data.temp > this.rec.tempU) {
							this.danger_datas.push(print_data)
							this.tempUA++;
						} else if (data.temp < this.rec.tempL) {
							this.danger_datas.push(print_data)
							this.tempLA++;
						}
					})
				}
				// console.log(this.sample_datas.length)
			},
			OpenBluetooth() {
				this.loading = true
				this.devices = []
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('第一步初始化蓝牙成功:' + res.errMsg);
						// 初始化完毕开始搜索
						this.StartBTDeviceDiscovery()
					},
					fail: (res) => {
						console.log('初始化蓝牙失败: ' + JSON.stringify(res));
						if (res.errCode == 10001) {
							uni.showToast({
								title: '蓝牙未打开',
								duration: 2000,
							})
						} else {
							uni.showToast({
								title: res.errMsg,
								duration: 2000,
							})
						}
					},
				});
			},
			/**
			 * 第二步 在页面显示的时候判断是都已经初始化完成蓝牙适配器若成功，则开始查找设备 
			 */
			StartBTDeviceDiscovery() {
				uni.startBluetoothDevicesDiscovery({
					// services: ['0000FFE0'],
					success: res => {
						console.log('第二步 开始搜寻附近的蓝牙外围设备：startBluetoothDevicesDiscovery success',
							res)
						this.OnBTDeviceFound();
					},
					fail: res => {
						uni.showToast({
							icon: "none",
							title: "查找设备失败！",
							duration: 3000
						})
					}
				});
			},

			/**
			 * 第三步  发现外围设备
			 */
			OnBTDeviceFound() {
				console.log("监听寻找新设备");
				uni.onBluetoothDeviceFound(res => {
					console.log("第三步 监听寻找到新设备的事件:", JSON.stringify(res))
					console.log("第三步 监听寻找到新设备列表:", res.devices)
					if (res.devices[0].name != "") {
						console.log(res.devices[0].name)
						this.devices.push(res.devices[0])
						if (res.devices[0].name != "Printer_461A_BLE") {
							this.StopBTDevicesDiscovery()
							console.log("结束查找设备!!!!!!!!!!!!!!!!!!!!!");
						}
					}
				});
			},
			/**
			 * 第四步 停止搜索蓝牙设备
			 */
			StopBTDevicesDiscovery() {
				this.loading = false
				uni.stopBluetoothDevicesDiscovery({
					success: res => {
						console.log("第四步 找到匹配的蓝牙后就关掉蓝牙搜寻:", JSON.stringify(res))
					},
					fail: res => {
						console.log('第四步 停止搜索蓝牙设备失败，错误码：' + res.errCode);
					}
				});
			},
			// 第五步 创建蓝牙连接,连接低功耗蓝牙设备
			CreateBLEConnection(DeviceID, index) {
				let doc = this
				uni.showToast({
					title: '连接设备中...',
					icon: "loading",
					duration: 3000
				});
				uni.createBLEConnection({ //创建蓝牙连接,连接低功耗蓝牙设备  
					deviceId: DeviceID, //传入刚刚获取的uuid  
					success(res) {
						console.log("第五步 创建蓝牙连接成功:", JSON.stringify(res))
						doc.GetBLEDeviceServices(DeviceID) //获取蓝牙设备所有服务(service)。

					},
					fail(res) {
						console.log(res)
						uni.showToast({
							title: '蓝牙连接失败...',
							icon: "error",
							duration: 3000,
						});
						uni.closeBLEConnection({
							deviceId: DeviceID,
							success(res) {
								uni.showToast({
									title: '请重新扫描...',
									icon: "success",
									duration: 3000
								});
							}
						})

					}
				})
			},
			//第六步 获取蓝牙设备所有服务(service)。
			async GetBLEDeviceServices(DeviceID, index) {
				let doc = this
				uni.showToast({
					title: '加载服务中...',
					icon: "loading",
					duration: 3000
				});
				await setTimeout(function() { //这里为什么要用setTimeout呢,等等下面会解释  
					uni.getBLEDeviceServices({ //获取蓝牙设备所有服务  
						deviceId: DeviceID,
						success(res) { //为什么要用延时,因为不用延时就拿不到所有的服务,在上一步,连接低功耗蓝牙  
							//设备的时候,需要一个600-1000毫秒的时间后,再去获取设备所有服务,不给延时就会一直返回错误码10004                               

							console.log("第六步 获取蓝牙设备所有服务:")
							console.log(res.services)
							doc.serverList = res.services
							uni.showToast({
								title: '选择服务中...',
								icon: "loading",
								duration: 30000,
							});
							setTimeout(() => {
								doc.select_service =
									"E7810A71-73AE-499D-8C15-FAA9AEF0C3F2"
								uni.showToast({
									title: '加载特征值中...',
									icon: "loading",
									duration: 30000
								});
								console.log("============================")
								console.log(doc.select_device)
								console.log("============================")
								console.log(doc.select_service)
								console.log("============================")
								setTimeout(() => {
									doc.GetBLEDeviceCharacteristics(doc
										.select_device, doc
										.select_service)
								}, 2000)
							}, 2000)
						},
						fail(res) {
							console.log(JSON.stringify(res))
							uni.showToast({
								title: '加载失败...',
								icon: "error",
								duration: 3000,
							});
						}
					})
				}, 2000)
			},
			// 第七步 获取蓝牙特征值
			GetBLEDeviceCharacteristics(DeviceID, ServiceUUID) {
				var _this = this
				console.log("第七步 获取蓝牙特征值DeviceID:", DeviceID, "serviceId:", ServiceUUID);
				uni.showToast({
					title: '选择特征值中...',
					icon: "loading",
					duration: 3000
				});
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({ //获取蓝牙设备某个服务中所有特征值  
						deviceId: DeviceID,
						serviceId: ServiceUUID, //这个serviceId可以在上一步获取中拿到,也可以在  
						//蓝牙文档中(硬件的蓝牙文档)拿到,我这里是通过文档直接赋值上去的,一般有两个,一个是收的uuid,一个是发的uuid,我们这边是发  
						success(res) {
							console.log("第七步 获取蓝牙设备某个服务中所有特征值成功:", JSON.stringify(res))
							uni.showToast({
								title: '蓝牙连接成功',
								duration: 3000
							});
							console.log(res)
							console.log(res.characteristics[0])
							console.log(res.characteristics[0].properties.read)
							console.log(res.characteristics[0].properties.write)
							console.log(res.characteristics[0].properties.notify)
							console.log(res.characteristics[0].properties.indicate)
							console.log(res.characteristics[0].uuid)
							_this.select_characteristicId = res.characteristics[0].uuid
						},
						fail(res) {
							console.log("获取蓝牙设备某个服务中所有特征值失败:", JSON.stringify(res))
							uni.showToast({
								title: '加载特征值失败...',
								icon: "error",
								duration: 3000,
							});
						}
					})
				}, 3000)
			},

			// 打印简报单
			async writeBLECharacteristicValue_brief() {
				if (!this.select_device) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备'
					})
					return
				}
				if (!this.select_service) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备服务'
					})
					return
				}
				if (!this.select_characteristicId) {
					uni.showToast({
						icon: 'none',
						title: '请选择特征值'
					})
					return
				}
				let printerJobs = new PrinterJobs()
				var brief = {
					start_time: this.rec.start_time,
					last_time: this.rec.last_time,
					device_name: this.rec.device_name,
					rec_id: this.rec.rec_id,
					tempL: this.rec.tempL,
					tempU: this.rec.tempU,
					tempLA: this.tempLA,
					tempUA: this.tempUA,
					count: this.datas.length,
					span: this.rec.recspan,
				}
				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('ct')
					.print(printerUtil.fillAround('切割线'))
					.text(printerUtil.inline('打印时间:', this.print_time))
				await setTimeout(() => {}, 3000)
				printerJobs
					.setSize(2, 2)
					.setBold(true)
					.setAlign('ct')
					.lineFeed()
					.print(`智能温度记录仪`)
					.print(`数据监测简报`)
					.setSize(1, 1)
					.setBold(false)
					.lineFeed()
					.print(printerUtil.fillAround('货物信息'))
					.setAlign('lt')
					// .printArray(arr)
					.print(printerUtil.inline('设备名:', `${brief.device_name}`))
					.print(printerUtil.inline('记录ID:', `${brief.rec_id}`))
					.print(printerUtil.inline('开始时间:', `${brief.start_time}`))
					.print(printerUtil.inline('结束时间:', `${brief.last_time}`))
					.print(printerUtil.inline('记录条目:', `${brief.count}条`))

				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('lt')
					.print(printerUtil.fillAround('监测结果简报'))
					.print(
						`本次运输自${brief.start_time}起,至${brief.last_time}止,每${brief.span}分钟记录一次,共记录${brief.count}条数据. 预设温度上限:${brief.tempU}℃,超限${brief.tempUA}次.预设温度下限:${brief.tempL}℃,超限${brief.tempLA}次.`
					)
				if (this.danger_datas.length != 0) {
					printerJobs.setBold(true)
						.setAlign('ct')
						.setSize(2, 2)
						.print(`运输过程不合格!`)
						.lineFeed()
						.setSize(1, 1)
						.setBold(false)
						.setAlign('lt')
						.print(printerUtil.fillAround('异常数据表'))
						.setAlign('lt')
						.printDatas(this.danger_datas)
				} else {
					printerJobs.setBold(true)
						.setAlign('ct')
						.setSize(2, 2)
						.print(`运输过程合格!`)
						.lineFeed()
						.setSize(1, 1)
						.setBold(false)
						.setAlign('lt')
						.print(printerUtil.fillAround('异常数据表'))
						.setAlign('lt')
						.print(`无异常数据`)

				}
				printerJobs
					.print(printerUtil.fillAround('签字区'))
					.lineFeed()
					.lineFeed()
					.lineFeed()
					.setAlign('rt')
					.setSize(1, 1)
					.setBold(true)
					.print(`时间：        `)
					.print(printerUtil.fillLine())
					.setAlign('lt')
					.setSize(1, 1)
					.setBold(false)
					.print(`详细数据请前往※安冷云官方网站※查看(anlengyun.com)，或下载※安冷云APP※查看`)
					.lineFeed()
					.lineFeed()
					.beep()
				let buffer = printerJobs.buffer();
				console.log('buffer>>>', buffer)
				this.printbuffs(buffer)
			},

			// 打印采样单
			async writeBLECharacteristicValue_sample() {
				if (!this.select_device) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备'
					})
					return
				}
				if (!this.select_service) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备服务'
					})
					return
				}
				if (!this.select_characteristicId) {
					uni.showToast({
						icon: 'none',
						title: '请选择特征值'
					})
					return
				}
				let printerJobs = new PrinterJobs()
				var brief = {
					start_time: this.rec.start_time,
					last_time: this.rec.last_time,
					device_name: this.rec.device_name,
					rec_id: this.rec.rec_id,
					tempL: this.rec.tempL,
					tempU: this.rec.tempU,
					tempLA: this.tempLA,
					tempUA: this.tempUA,
					count: this.datas.length,
					span: this.rec.recspan,
				}
				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('ct')
					.print(printerUtil.fillAround('切割线'))
					.text(printerUtil.inline('打印时间:', this.print_time))
				await setTimeout(() => {}, 3000)
				printerJobs
					.setSize(2, 2)
					.setBold(true)
					.setAlign('ct')
					.lineFeed()
					.print(`智能温度记录仪`)
					.print(`数据监测采样报告`)
					.setSize(1, 1)
					.setBold(false)
					.lineFeed()
					.print(printerUtil.fillAround('货物信息'))
					.setAlign('lt')
					// .printArray(arr)
					.print(printerUtil.inline('设备名:', `${brief.device_name}`))
					.print(printerUtil.inline('记录ID:', `${brief.rec_id}`))
					.print(printerUtil.inline('开始时间:', `${brief.start_time}`))
					.print(printerUtil.inline('结束时间:', `${brief.last_time}`))
					.print(printerUtil.inline('记录条目:', `${brief.count}条`))

				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('lt')
					.print(printerUtil.fillAround('监测结果简报'))
					.print(
						`本次运输自${brief.start_time}起,至${brief.last_time}止,每${brief.span}分钟记录一次,共记录${brief.count}条数据. 预设温度上限:${brief.tempU}℃,超限${brief.tempUA}次.预设温度下限:${brief.tempL}℃,超限${brief.tempLA}次.`
					)
				if (this.danger_datas.length != 0) {
					printerJobs.setBold(true)
						.setAlign('ct')
						.setSize(2, 2)
						.print(`运输过程不合格!`)
						.lineFeed()
						.setSize(1, 1)
						.setBold(false)
						.setAlign('lt')
						.print(printerUtil.fillAround('异常数据表'))
						.setAlign('lt')
						.printDatas(this.danger_datas)
				} else {
					printerJobs.setBold(true)
						.setAlign('ct')
						.setSize(2, 2)
						.print(`运输过程合格!`)
						.lineFeed()
						.setSize(1, 1)
						.setBold(false)
						.setAlign('lt')
						.print(printerUtil.fillAround('异常数据表'))
						.setAlign('lt')
						.print(`无异常数据`)
				}
				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('lt')
					.print(printerUtil.fillAround('采样数据表'))
					.setAlign('lt')
					.printDatas(this.sample_datas)
				printerJobs
					.print(printerUtil.fillAround('签字区'))
					.lineFeed()
					.lineFeed()
					.lineFeed()
					.setAlign('rt')
					.setSize(1, 1)
					.setBold(true)
					.print(`时间：        `)
					.print(printerUtil.fillLine())
					.setAlign('lt')
					.setSize(1, 1)
					.setBold(false)
					.print(`详细数据请前往※安冷云官方网站※查看(anlengyun.com)，或下载※安冷云APP※查看`)
					.lineFeed()
					.lineFeed()
					.beep()
				let buffer = printerJobs.buffer();
				console.log('buffer>>>', buffer)
				this.printbuffs(buffer)
			},

			// 打印详情单
			async writeBLECharacteristicValue() {
				this.xiangdan_loading = true
				this.xiangqing_alarm_show = false
				let that = this
				if (!that.select_device) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备'
					})
					return
				}
				if (!that.select_service) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备服务'
					})
					return
				}
				if (!that.select_characteristicId) {
					uni.showToast({
						icon: 'none',
						title: '请选择特征值'
					})
					return
				}
				let printerJobs = new PrinterJobs()
				var brief = {
					start_time: that.rec.start_time,
					last_time: that.rec.last_time,
					device_name: that.rec.device_name,
					rec_id: that.rec.rec_id,
					tempL: that.rec.tempL,
					tempU: that.rec.tempU,
					tempLA: that.tempLA,
					tempUA: that.tempUA,
					count: that.datas.length,
					span: that.rec.recspan,
				}
				printerJobs
					.setSize(1, 1)
					.setBold(false)
					.setAlign('ct')
					.print(printerUtil.fillAround('切割线'))
					.text(printerUtil.inline('打印时间:', that.print_time))
				let buffer = printerJobs.buffer();
				console.log('buffer>>>', buffer)
				that.printbuffs(buffer)

				await setTimeout(async () => {
					printerJobs = new PrinterJobs()
					printerJobs
						.setSize(2, 2)
						.setBold(true)
						.setAlign('ct')
						.lineFeed()
						.print(`智能温度记录仪`)
						.print(`数据监测报告`)
						.setSize(1, 1)
						.setBold(false)
						.lineFeed()
						.print(printerUtil.fillAround('货物信息'))
						.setAlign('lt')
						// .printArray(arr)
						.print(printerUtil.inline('设备名:', `${brief.device_name}`))
						.print(printerUtil.inline('记录ID:', `${brief.rec_id}`))
						.print(printerUtil.inline('开始时间:', `${brief.start_time}`))
						.print(printerUtil.inline('结束时间:', `${brief.last_time}`))
						.print(printerUtil.inline('记录条目:', `${brief.count}条`))
						.lineFeed()
					let buffer = printerJobs.buffer();
					console.log('buffer>>>', buffer)
					that.printbuffs(buffer)
					await setTimeout(async () => {
						let printerJobs = new PrinterJobs()
						printerJobs
							.setSize(1, 1)
							.setBold(false)
							.setAlign('lt')
							.print(printerUtil.fillAround('监测结果简报'))
							.print(
								`本次运输自${brief.start_time}起,至${brief.last_time}止,每${brief.span}分钟记录一次,共记录${brief.count}条数据. 预设温度上限:${brief.tempU}℃,超限${brief.tempUA}次.预设温度下限:${brief.tempL}℃,超限${brief.tempLA}次.`
							)
							.lineFeed()
						if (that.danger_datas.length != 0) {
							printerJobs.setBold(true)
								.setAlign('ct')
								.setSize(2, 2)
								.print(`运输过程不合格!`)
								.lineFeed()
						} else {
							printerJobs.setBold(true)
								.setAlign('ct')
								.setSize(2, 2)
								.print(`运输过程合格!`)
								.lineFeed()
						}
						let buffer = printerJobs.buffer();
						console.log('buffer>>>', buffer)
						that.printbuffs(buffer)

						await setTimeout(async () => {
							let printerJobs =
								new PrinterJobs();
							if (that.danger_datas
								.length != 0) {
								printerJobs
									.setSize(1, 1)
									.setBold(false)
									.setAlign('lt')
									.print(printerUtil
										.fillAround(
											'异常数据表'))
									.setAlign('lt')
									.printDatas(that
										.danger_datas)
							} else {
								printerJobs
									.setSize(1, 1)
									.setBold(false)
									.setAlign('lt')
									.print(printerUtil
										.fillAround(
											'异常数据表'))
									.setAlign('lt')
									.print(`无异常数据`)
							}
							printerJobs
								.print(printerUtil
									.fillAround(
										'签字区'))
								.lineFeed()
								.lineFeed()
								.lineFeed()
								// .printArray(arr2)
								.setAlign('rt')
								.setSize(1, 1)
								.setBold(true)
								.print(`时间：        `)
								.print(printerUtil
									.fillLine())
								.setAlign('lt')
								.setSize(1, 1)
								.setBold(false)
								.print(printerUtil
									.fillAround(
										'数据表'))
							let buffer = printerJobs
								.buffer();
							console.log('buffer>>>',
								buffer)
							that.printbuffs(buffer)
							await setTimeout(async () => {
								let printerJobs =
									new PrinterJobs()
								printerJobs
									.setSize(1,
										1)
									.setBold(
										false)
									.setAlign(
										'lt')
								let buffer =
									printerJobs
									.buffer();
								console.log(
									'buffer>>>',
									buffer)
								that.printbuffs(
									buffer)
								await that
									.print_datas
									.forEach(
										async (data_list,
											index
										) => {
											await setTimeout
												(
													async () => {
															if (index ==
																(that
																	.print_datas
																	.length -
																	1
																	)
															) 	{
																setTimeout
																	(() => {
																			that.xiangdan_loading =
																				false
																		},
																		12000
																		)
															}
															let printerJobs =
																new PrinterJobs();
															printerJobs
																.printDatas(
																	data_list
																)
															let buffer =
																printerJobs
																.buffer();
															console
																.log(
																	'buffer>>>',
																	buffer
																)
															that.printbuffs(
																buffer
															)
														},
														12000 *
														index)
										})
							}, 5000)
						}, 5000)
					}, 3000)
				}, 1000)
			},
			print_end() {

			},

			printbuffs(buffer) {
				// 1.并行调用多次会存在写失败的可能性
				// 2.建议每次写入不超过20字节
				// 分包处理，延时调用 
				const maxChunk = 20;
				const delay = 150;
				for (let i = 0, j = 0, length = buffer.byteLength; i < length; i += maxChunk,
					j++) {
					let subPackage = buffer.slice(i, i + maxChunk <= length ? (i + maxChunk) :
						length);
					setTimeout(this.printbuff, j * delay, subPackage);
				}
			},
			printbuff(buffer) {
				var _this = this
				uni.writeBLECharacteristicValue({
					// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
					deviceId: _this.select_device,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: _this.select_service,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: _this.select_characteristicId,
					// 这里的value是ArrayBuffer类型
					value: buffer,
					success: (res) => {
						console.log('writeBLECharacteristicValue success', res
							.errMsg)
					},
					fail: (res) => {
						console.log('writeBLECharacteristicValue fail', res.errMsg)
					},
					complete(e) {
						console.log('writeBLECharacteristicValue complete', e)
					}
				})
			},
			radioChange(e) {
				console.log(e)
				this.StopBTDevicesDiscovery()
				this.select_device = e.target.value
				console.log(this.select_device)
				this.CreateBLEConnection(this.select_device)
			},

			getTime() {
				var date = new Date();
				var month = date.getMonth() + 1;
				var hours = date.getHours();
				if (hours < 10)
					hours = "0" + hours;
				var minutes = date.getMinutes();
				if (minutes < 10)
					minutes = "0" + minutes;
				var seconds = date.getSeconds();
				if (seconds < 10)
					seconds = "0" + seconds;
				var time = date.getFullYear() + "-" + month + "-" + date.getDate() +
					" " + hours + ":" + minutes + ":" + seconds;
				return time;
			},
		}
	}
</script>

<style lang="scss">
	.devices_list {
		margin: 10px;
	}

	.content {
		margin: 10px;
		margin-bottom: 10px;
		padding: 5rpx;
	}

	.u-button {
		margin-bottom: 10px;
	}
</style>
