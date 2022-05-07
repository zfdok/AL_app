<template>
	<view>
		{{this.params}}
		<web-view :src="this.params.link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {},
			};
		},
		onLoad(options) {
			this.params = options
		}
	}
</script>

<style lang="scss">

</style>
