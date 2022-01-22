<template>
	<view>
		<view class="notice_card" :style="{'background':statusColor}">
			<u-avatar class="notice_card_icon" :src="notice.icon"></u-avatar>
			<view class="notice_card_content">
				{{notice.desc}}
				<u-link v-if="notice.type=='notice'" :href="notice.ad_url" text="去看看"></u-link>
			</view>
			<view class="notice_card_btn">
				<u-button v-if="notice.type=='alert'" type="primary" size="mini" :color="statusBtnColor"
					@click="cancle_ad">已读</u-button>
				<u-button v-if="notice.type=='notice'" type="primary" size="mini" :color="statusBtnColor"
					@click="ad_show=true">详情
				</u-button>
			</view>
		</view>
		<u-modal :show="ad_show" :title="notice.title" @confirm="goto_ad" @cancel="cancle_ad" confirmText="详情"
			showCancelButton cancelText="不再提示">
			<view class="slot-content ">
				<image :src='notice.ad_img' mode="widthFix"></image>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: "noticecard",
		props: {
			notice: {
				type: Object,
				default: () => {
					return {

					}
				}
			},
		},
		data() {
			return {
				statusColor: "#cecece",
				statusBtnColor: "#cecece",
				ad_show: false
			};
		},
		mounted() {
			switch (this.notice.type) {
				case "alert":
					this.statusColor = "linear-gradient(to right, rgb(255, 135, 147),rgb(235, 184, 255))"
					this.statusBtnColor = "linear-gradient(to right,rgb(170, 59, 70), rgb(154, 103, 0))"
					break
				case 'notice':
					this.statusColor = "linear-gradient(to right,rgb(170, 255, 255) ,rgb(170, 255, 165) )"
					this.statusBtnColor = "linear-gradient(to right, rgb(73, 75, 181),rgb(0, 170, 127))"
					break
				default:
					break
			}
		},
		methods: {
			cancle_ad() {
				this.ad_show = false
				this.$emit('card_btn_click', 1)
				//这里要重置数据库已读
			},
			goto_ad() {
				this.ad_show = false
				if (plus.os.name == 'Android') { //判断平台为Android
					plus.runtime.openURL(this.notice.ad_url);
				} else if (plus.os.name == 'iOS') { //判断平台为IOS
					plus.runtime.openURL(this.notice.ad_url);
				} else {

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notice_card {
		background-color: #4CD964;
		margin-top: 20rpx;
		margin-right: 20rpx;
		margin-left: 20rpx;
		border-radius: 20rpx;
		padding: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.notice_card_content {
			margin-left: 20rpx;
			margin-right: 20rpx;
			font-size: 27rpx;
			color: #222;
			flex-grow: 1;
		}

		.notice_card_btn {}
	}
</style>
