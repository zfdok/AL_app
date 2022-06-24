<template>
	<view>
		<view class="info_card">
			<view class="report_h1">
				信息设置
			</view>
			<u-subsection :list="['基本信息', '运输信息']" :current="curNow" @change="sectionChange"></u-subsection>
			<view class="sense0" v-show="curNow==0">
				<view class="report_title">
					基本信息
				</view>
				<view class="report_form">
					<u--form labelPosition="left" labelWidth=100 :model="info" ref="form1">
						<u-form-item label="设备ID:" prop="info.device_name" borderBottom ref="item1">
							<u--input v-model="info.device_name" disabled border="none"></u--input>
						</u-form-item>
						<u-form-item label="记录ID:" prop="info.id" borderBottom ref="item1">
							<u--input v-model="info.id" disabled border="none"></u--input>
						</u-form-item>
						<u-form-item label="发货时间:" prop="info.start_time" borderBottom ref="item1">
							<u--input v-model="info.start_time" disabled border="none"></u--input>
						</u-form-item>
						<u-form-item label="收货时间:" prop="info.last_time" borderBottom ref="item1">
							<u--input v-model="info.last_time" disabled border="none"></u--input>
						</u-form-item>
					</u--form>
				</view>
				<view class="report_title">
					货物信息
				</view>
				<view class="report_form">
					<u--form labelPosition="left" labelWidth=100 :model="info" ref="form1">
						<u-form-item label="货物名称" prop="info.goods_name" borderBottom ref="item1">
							<u--input v-model="info.goods_name" border="none"></u--input>
						</u-form-item>
						<u-form-item label="货物数量:" borderBottom ref="item1">
							第
							<u--input v-model="info.goods_count"></u--input>
							件, 共
							<u--input v-model="info.goods_all_count"></u--input>件
						</u-form-item>
						<u-form-item label="预设温度:" borderBottom ref="item1">
							<u--input v-model="info.tempL" disabled></u--input>
							℃~
							<u--input v-model="info.tempU" disabled></u--input>℃
						</u-form-item>
						<u-form-item label="货物品类:" prop="info.last_time" borderBottom ref="item1"
							@click="goods_type_show = true;">
							<u--input v-model="info.goods_type" disabled disabledColor="#ffffff" border="none">
							</u--input>
							<u-icon slot="right" name="arrow-right"></u-icon>
							<u-action-sheet :show="goods_type_show" :actions="actions" title="请选择货物品类"
								@close="goods_type_show = false" @select="sexSelect">
							</u-action-sheet>
						</u-form-item>
						<u-form-item label="采集间隔:" prop="info.recspan" borderBottom ref="item1">
							<u--input v-model="info.recspan" disabled border="none"></u--input>
						</u-form-item>
					</u--form>
				</view>
			</view>
			<view class="sense1" v-show="curNow==1">
				<view class="report_title">
					发货方信息
				</view>
				<view class="report_form">
					<u--form labelPosition="left" labelWidth=100 :model="info" ref="form1">
						<u-form-item label="发货方" prop="info.sender_name" borderBottom ref="item1">
							<u--input v-model="info.sender_name" border="none"></u--input>
						</u-form-item>
						<u-form-item label="电话:" prop="info.sender_phone" borderBottom ref="item1">
							<u--input v-model="info.sender_phone" border="none"></u--input>
						</u-form-item>
						<u-form-item label="发货地点:" prop="info.sender_address" borderBottom ref="item1">
							<u--input v-model="info.sender_address" border="none"></u--input>
						</u-form-item>
					</u--form>
				</view>
				<view class="report_title">
					承运方信息
				</view>
				<view class="report_form">
					<u--form labelPosition="left" labelWidth=100 :model="info" ref="form1">
						<u-form-item label="承运方" prop="info.transer_name" borderBottom ref="item1">
							<u--input v-model="info.transer_name" border="none"></u--input>
						</u-form-item>
						<u-form-item label="电话:" prop="info.transer_phone" borderBottom ref="item1">
							<u--input v-model="info.transer_phone" border="none"></u--input>
						</u-form-item>
					</u--form>
				</view>
				<view class="report_title">
					收货方信息
				</view>
				<view class="report_form">
					<u--form labelPosition="left" labelWidth=100 :model="info" ref="form1">
						<u-form-item label="收货方" prop="info.reciver_name" borderBottom ref="item1">
							<u--input v-model="info.reciver_name" border="none"></u--input>
						</u-form-item>
						<u-form-item label="电话:" prop="info.reciver_phone" borderBottom ref="item1">
							<u--input v-model="info.reciver_phone" border="none"></u--input>
						</u-form-item>
						<u-form-item label="发货地点:" prop="info.reciver_address" borderBottom ref="item1">
							<u--input v-model="info.reciver_address" border="none"></u--input>
						</u-form-item>
					</u--form>
				</view>
			</view>
		</view>
		<view class="btn_card">
			<u-button class="btn_card_btn" type="primary" icon="attach" @click="gen_pdf" text="生成PDF"></u-button>
			<u-button class="btn_card_btn" icon="download" :disabled="!download_enabled" type="success" @click="Download" text="下载PDF"></u-button>
			<!-- <u-button class="btn_card_btn" icon="share" :disabled="!share_enabled" type="warning " @click="share_pdf" text="分享PDF"></u-button> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rec: {},
				filename: "",
				curNow: 0,
				goods_type_show: false,
				actions: [{
						name: '常温',
					},
					{
						name: '冷冻',
					},
					{
						name: '冷鲜',
					}, {
						name: '药品',
					}, {
						name: '血液类',
					}, {
						name: '疫苗类',
					}, {
						name: '生物标本类',
					},
				],
				info: {
					id: 781,
					device_name: 'al_kh00001_zx_0001',
					start_time: '2022-03-03 14:13:11',
					last_time: '2022-03-03 21:00:31',
					tempL: -50,
					tempU: 50,
					goods_name: '冷运物品',
					goods_type: '常规',
					goods_count: 1,
					goods_all_count: 1,
					sender_name: '略',
					sender_phone: '略',
					sender_address: '略',
					transer_name: '略',
					transer_phone: '略',
					reciver_name: '略',
					reciver_phone: '略',
					reciver_address: '略',
					recspan: 5,
					product_id: '4LwKzUwOpX'
				},
				download_enabled: false,
				share_enabled:false
			};
		},
		onLoad(options) {
			this.rec = JSON.parse(options.rec)
			this.filename = `${this.rec.device_name}_${this.rec.rec_id}`;
			this.info.id = this.rec.rec_id;
			this.info.device_name = this.rec.device_name;
			this.info.start_time = this.rec.start_time;
			this.info.last_time = this.rec.last_time;
			this.info.tempL = this.rec.tempL;
			this.info.tempU = this.rec.tempU;
			this.info.recspan = this.rec.recspan;
			this.info.product_id = this.rec.product_id;
		},
		methods: {
			// 选择货物种类
			sexSelect(e) {
				this.info.goods_type = e.name
				this.goods_type_show = false
			},
			// 修改索引
			sectionChange(index) {
				this.curNow = index;
			},
			// 生成PDF
			async gen_pdf() {
				uni.showLoading({
					title: '更新信息设置',
					mask: false
				});
				let res1 = await this.$u.api.set_rec_info({
					params: this.info
				})
				uni.hideLoading()
				uni.showLoading({
					title: "生成PDF中..."
				})
				let params = {
					name: this.filename,
					device_name: this.rec.device_name,
					start_time: this.rec.start_time,
					last_time: this.rec.last_time,
					type: this.rec.type,
				}
				let res = await this.$u.api.gen_report({
					params
				})
				uni.hideLoading()
				this.download_enabled = true
			},
			// 分享PDF
			share_pdf() {
				let that = this
				uni.shareWithSystem({
					summary: '',
					href: `file://storage/emulated/0/anlengyun/${that.filename}.pdf`,
					success() {

					},
					fail() {
						uni.showToast({
							title: '分享失败'
						});
					}
				})
			},
			// 下载PDF
			Download() {
				let that = this
				var url = `https://anlengyun.com/report/${that.filename}.pdf`
				uni.showLoading({
					title: '下载中...',
					mask: true
				});
				let dtask = plus.downloader.createDownload(url, {
						//本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0，就是用户文件管理器能看到的了，之后我创建微垠作为文件夹，后缀是用于文件命名和格式修改，大家可以使用变量。
						filename: `file://storage/emulated/0/anlengyun/${that.filename}.pdf` //利用保存路径，实现下载文件的重命名
					},
					function(d, status) {
						//d为下载的文件对象
						if (status == 200) {
							uni.hideLoading()
							uni.showToast({
								icon: "success",
								title: "下载完成",
								duration: 2000
							})
							//下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
							let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
							plus.runtime.openFile(d.filename); //选择软件打开文件
						} else {
							//下载失败
							plus.downloader.clear(); //清除下载任务
						}
					})
				dtask.start();
				this.share_enabled = true
			}
		}
	}
</script>

<style lang="scss">
	.info_card {
		margin: 10px;
		padding: 10px;
		border-radius: 10px;
		box-shadow: 0px 0px 3px #888888;
	}

	.btn_card {
		margin: 10px;
		display: flex;

		.btn_card_btn {
			margin: 5rpx;
		}
	}

	.report_h1 {
		text-align: center;
		font-weight: bold;
		color: #366092;
		font-size: 40rpx;
	}

	.report_title {
		text-align: center;
		font-weight: bold;
	}
</style>
