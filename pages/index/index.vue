<template>
	<view class="container">
		<image class="bg-set" src="/static/myback.png"></image>
		<u-sticky>
			<u-avatar class="index_avatar" src="https://img.anlengyun.com/user_avatar.png" @click="avatar_click">
			</u-avatar>
			<image class="sticky_top" src="/static/myback2.png"></image>
		</u-sticky>
		<u-sticky offsetTop=90>
			<view class="scroll-list">
				<u-grid :border="false" col="4">
					<u-grid-item v-for="(item, index) in product_list" :key="index">
						<u-avatar :src="item.thumb" @click="product_selected(item, index)" size="50"></u-avatar>
						<text class="scroll-list__goods-item__text">{{ item.name }}</text>
					</u-grid-item>
					<u-grid-item>
						<u-avatar icon="scan" size="50" fontSize="32" @click="scan_new"></u-avatar>
						<text class="scroll-list__goods-item__text">添加设备</text>
					</u-grid-item>
				</u-grid>
			</view>
		</u-sticky>
		<view class="content">
			<view class="ad">
				<u-swiper class="ad_swiper" :list="swiper_list" indicator indicatorMode="line" circular radius=10
					keyName="img" :autoplay="true" @click="swiper_clicked">
				</u-swiper>
			</view>

			<view class="dongtai">
				<view class="dongtai__title">安冷云动态</view>
				<view v-if="news_list.length !=0">
					<newscard v-for="news in news_list" :news="news" @card_click="news_click(news)"></newscard>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiper_list: [{
					"id": 4,
					"img": "https://img.anlengyun.com/anlengAPP/ad4.png",
					"url": "https://anlengyun.com/news/test1.html"
				}, {
					"id": 3,
					"img": "https://img.anlengyun.com/anlengAPP/ad3.jpg",
					"url": "https://anlengyun.com/news/test2.html"
				}, {
					"id": 2,
					"img": "https://img.anlengyun.com/anlengAPP/ad2.jpg",
					"url": "https://anlengyun.com"
				}, {
					"id": 1,
					"img": "https://img.anlengyun.com/anlengAPP/ad1.jpg",
					"url": "https://anlengyun.com"
				}, ],
				news_list: [],
				product_list: []
			}
		},
		async onLoad() {
			if (!this.$u.utils.isLogin()) return
			this.product_list = this.vuex_product_list
			await this.get_appswiper_list()
			await this.get_news_list()
		},
		methods: {
			swiper_clicked(index) {
				if (plus.os.name == 'Android') { //判断平台为Android
					plus.runtime.openURL(this.swiper_list[index].url);
				} else if (plus.os.name == 'iOS') { //判断平台为IOS
					plus.runtime.openURL(this.swiper_list[index].url);
				} else {

				}
			},
			async get_appswiper_list() {
				let params = {}
				let res = await this.$u.api.get_swiper({
					params
				})
				if (res.data) {
					this.swiper_list = res.data
				}
			},
			async get_news_list() {
				let params = {}
				let res = await this.$u.api.get_news({
					params
				})
				if (res.data) {
					this.news_list = res.data
				}
			},
			product_selected(item, index) {
				this.$u.vuex('vuex_product_index', index)
				uni.$u.route({
					type: 'reLaunch',
					url: 'pages/device/device',
				})
			},
			avatar_click() {
				uni.$u.route({
					type: 'reLaunch',
					url: 'pages/my/my',
				})
			},
			news_click(news) {
				// console.log(news)
				uni.$u.route({
					url: 'pages/index/index_news',
					params: news
				})
			},
			scan_new() {
				uni.scanCode({
					onlyFromCamera: true,
					scanType: ['barCode'],
					success: function(res) {
						let code_res = {
							type: res.scanType,
							value: res.result
						}
						if (res.scanType == "CODE_128") {
							uni.showToast({
								icon: "success",
								title: "扫描成功!",
								duration: 3000
							})
							uni.$u.route({
								url: 'pages/index/index_scan',
								params: code_res
							})
						} else {
							uni.showToast({
								icon: "error",
								title: "失败,请重试",
								duration: 3000
							})
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.index_avatar {
		position: absolute;
		z-index: 6;
		margin-top: 80rpx;
		margin-left: 40rpx;
	}

	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.sticky_top {
		width: 100%;
		height: 260rpx;
		z-index: -1;
	}

	.scroll-list {
		margin-left: 40rpx;
		margin-right: 40rpx;
		margin-top: -40rpx;
		z-index: 8;
		box-shadow: 0px 1px 1px #4c4c4c;
		@include flex(column);
		padding: 15rpx;
		background-color: #eee;

		border: {
			radius: 20rpx;
		}

		;

		&__goods-item {
			margin-right: 20px;

			&__text {
				color: #2980b9;
				width: 100px;
				text-align: center;
				font-size: 13px;
				font-weight: 700;
				margin-top: 5px;
				margin-bottom: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 12px;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}
	}

	.content {
		// margin-top: 160rpx;
		padding: 40rpx;

		.ad {
			display: flex;
			justify-content: center;

			.ad_swiper {
				width: 100%;
				margin-bottom: 40rpx;
			}
		}

	}

	.dongtai {
		background-color: rgba(255, 255, 255, 0.8);
		padding: 20rpx;
		overflow: hidden;

		border: {
			radius: 20rpx;
		}

		;

		&__title {
			text-align: center;
			color: #00007f;

			font : {
				size: 50rpx;
				weight: bold;
			}
		}
	}
</style>
