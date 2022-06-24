<script>
	export default {
		onLaunch: async function() {
			let res = await this.check_at_start()
			this.product_list = this.vuex_product_list
			this.$u.vuex('vuex_product_index', this.vuex_default_product_index)
			// if (res.code == 200) {
			// 	uni.switchTab({
			// 		url: this.vuex_default_page
			// 	});
			// }
		},
		onShow: async function() {
			let res = await this.check_appversion()
			let that = this
			if (res.update_status) {
				this.update_app(res)
			}
		},
		onHide: function() {

		},
		methods: {
			async check_at_start() {
				let res = await this.$u.api.checktoken()
				return res
			},
			async check_appversion() {
				let params = {
					version: this.vuex_version
				}
				let res = await this.$u.api.get_version({
					params
				})
				return res
			},
			async update_app(res) {
				uni.showModal({
					title: "发现新版本",
					content: "升级内容:\n\t\t" + res.data.notes,
					confirmText: "自动升级",
					showCancel: false,
					cancelText: "暂不升级",
					success: () => {
						uni.showLoading({
							title: '下载中...',
							mask: false
						});
						var url = res.data.update_url
						let filename = `file://storage/emulated/0/anlengyun/${res.data.full_version}`
						let dtask = plus.downloader.createDownload(url, {
								//本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0，就是用户文件管理器能看到的了，之后我创建微垠作为文件夹，后缀是用于文件命名和格式修改，大家可以使用变量。
								filename: "_downloads/"
								//利用保存路径，实现下载文件的重命名
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
									plus.runtime.install(d.filename, {
										force: true
									}, function() {
										//进行重新启动;
										plus.runtime.restart();
									}, (e) => {
										uni.showToast({
											title: '安装升级包失败:' + JSON
												.stringify(e),
											icon: 'none'
										})
									});
								} else {
									//下载失败
									plus.downloader.clear(); //清除下载任务
								}
							})
						dtask.start();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	page {}
</style>
