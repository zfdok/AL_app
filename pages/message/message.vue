<template>
	<view>
		<view class="reflash" v-show="reflash_show">
			↓ 下拉刷新 ↓
		</view>
		<view v-for="(notice,index) in notice_notices" :key="'notice'+index">
			<noticecard @card_btn_click="readnotice(notice)" :notice="notice"></noticecard>
		</view>
		<view v-for="(notice,index) in alert_notices" :key="'alert'+index">
			<noticecard @card_btn_click="readnotice(notice)" :notice="notice"></noticecard>
		</view>
	</view>
</template>

<script>
	let time_m;
	export default {

		data() {
			return {
				notices: [],
				notice_notices: [],
				alert_notices: [],
				reflash_show: true,
			}
		},
		onLoad() {
			if (!this.$u.utils.isLogin()) return
			clearInterval(time_m)
			time_m = setInterval(() => {
				let pages = getCurrentPages();
				let curPage = pages[pages.length - 1].route;
				if (curPage == 'pages/message/message') {
					this.get_headernotice()
				}
			}, 60000)
		},
		onShow() {
			this.reflash_show = true
			this.get_headernotice()
			setTimeout(() => {
				this.reflash_show = false
			}, 3000)
		},
		onPullDownRefresh() {
			this.get_headernotice()
			this.reflash_show = true
			setTimeout(() => {
				this.reflash_show = false
				uni.stopPullDownRefresh()
			}, 2000)
		},
		watch: {
			notices() {
				this.notice_notices = []
				this.alert_notices = []
				this.notices.forEach(notice => {
					switch (notice.type) {
						case "notice":
							this.notice_notices.push(notice)
							break
						case "alert":
							this.alert_notices.push(notice)
							break
						default:
							break
					}

				})
			}
		},
		methods: {
			async get_headernotice() {
				let params = {
					user: this.vuex_user.name
				}
				let res = await this.$u.api.get_headernotice({
					params
				})
				this.notices = res.data
				console.log(this.notices)
			},
			async readnotice(notice) {
				console.log(notice.msg_id)
				let params = {
					msg_id: notice.msg_id
				}
				let res = await this.$u.api.readnotice({
					params
				})
				this.get_headernotice()
			}

		}
	}
</script>

<style lang="scss" scoped>
	.reflash {
		text-align: center;
	}
</style>
