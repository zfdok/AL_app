<script>
	export default {
		onLaunch: async function() {
			let res = await this.check_at_start()
			this.product_list = this.vuex_product_list
			this.$u.vuex('vuex_product_index', this.vuex_default_product_index)
			if (res.code == 200) {
				uni.switchTab({
					url: this.vuex_default_page
				});
			}
		},
		onShow: async function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			async check_at_start() {
				let res = await this.$u.api.checktoken()
				return res
			},
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";

	page {}
</style>
