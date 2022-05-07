<template>
	<view>
		<view class="box1">
			<u-collapse accordion>
				<u-collapse-item v-for="(rec,index) in recs" :title="`[${index+1}]--${rec.start_time}到${rec.last_time}`"
					name="Docs guide">
					<text class="u-collapse-content">记录ID: {{rec.id}}</text>
					<text class="u-collapse-content">记录设备: {{params.name}}({{params.device_name}})</text>
					<text class="u-collapse-content">开始时间: {{rec.start_time}}</text>
					<text class="u-collapse-content">结束时间: {{rec.last_time}}</text>
					<u-button type="primary" plain @click="goto_a_rec(rec.id,rec.start_time,rec.last_time,rec.tempL,rec.tempU,rec.recspan,rec.id)">查看历史数据</u-button>
				</u-collapse-item>
			</u-collapse>
		</view>
		<view class="box2">
			请前往安冷云PC版获取更多数据
			<u-link href="https://anlengyun.com" text="anlengyun.com"></u-link>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {},
				recs: []
			}
		},
		onLoad(options) {
			if (!this.$u.utils.isLogin()) return
			this.params = options
			this.get_history_list()
			
		},
		methods: {
			async get_history_list() {
				uni.showLoading({
					title: '加载中...',
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 8000)
				let params = {
					user: this.params.user,
					type: this.params.type,
					device: this.params.device_name,
				}
				let res = await this.$u.api.get_device_history_list({
					params
				})
				this.recs = res.data
				if (res){
					setTimeout(() => {
						uni.hideLoading();
					}, 1000)
				}
			},
			goto_a_rec(rec_id,start_time,last_time,tempL,tempU,recspan,recid) {
				let user = this.params.user
				let type = this.params.type
				let name = this.params.name
				let device_name = this.params.device_name
				let product_id = this.params.product_id
				const params = {
					user,
					type,
					device_name,
					name,
					product_id,
					rec_id,
					start_time,
					last_time,
					tempL,
					tempU,
					recspan,
					recid,
				}
				uni.$u.route({
					url: 'pages/history/history_rec',
					params
				})
			}
		}
	}
</script>

<style lang="scss">
	.box1 {
		.u-collapse-content {
			margin-bottom: 20rpx;
		}
	}

	.box2 {
		width: 100%;
		height: 50rpx;
		background-color: #edf2ff;
		// text-align: center;
		display: flex;
		justify-content: space-between;
		padding: 40rpx;
	}

	.box3 {
		width: 100%;
		height: 100rpx;
		background-color: #ff0099;
	}
</style>
