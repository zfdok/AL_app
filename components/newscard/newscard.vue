<template>

	<view class="card" @click="handle_click">
		<view class="card_img">
			<u--image :src="news.title_img" shape="square" height="100rpx" mode="heightFix"></u--image>
		</view>
		<view class="card_content">
			<view class="card_content_title">
				<u--text :text="news.title" color="#444" bold :lines="2" size=15></u--text>
			</view>
			<view class="card_content_title">
				<u--text :text="news.summary" color="#aaa" :lines="2" size=11></u--text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "newscard",
		props: {
			news: {
				type: Object,
				default: () => {
					return {
						id: 1,
						title: "haha",
						summary: "hhhhhhhhhhhhhhhhhhh如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长如果很长很长很长很长很长很长很长很长很长很长很长很长",
						title_img: "https://img.anlengyun.com/news.png",
						link: "https://mp.weixin.qq.com/s/t7wnUdd6fm92HnpVye8LEw"
					}
				}
			},
		},
		data() {
			return {

			};
		},
		methods: {
			handle_click() {
				this.$emit('card_click', 1)
			},
		}
	}
</script>

<style lang="scss">
	.card {
		display: flex;
		height: 120rpx;
		overflow: hidden;
		margin-top: 10rpx;
		margin-bottom: 10rpx;

		// background-color: #aaffff;
		.card_img {
			padding: 10rpx;
			justify-content: center;
			// margin-right: 10rpx;
		}

		.card_content {
			margin-left: 10prx;
			justify-content: center;
		}
	}
</style>
