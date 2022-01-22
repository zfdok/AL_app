<template>
	<view>
		???
		<!-- 		<view class="charts-box">
			<qiun-data-charts type="line" :chartData="chartData" :echartsH5="true" :echartsApp="true"
				:disableScroll="true" :ontouch="true"/>
		</view> -->

		<view class="charts-box">
			<qiun-data-charts type="area" :chartData="chartData" :disableScroll="true" background="none"
				:tapLegend="false" :ontouch="true" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chartData: {
					categories: [
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021",
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021",
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021"
					],
					series: [{
						name: "成交量A",
						data: [
							35,
							8,
							25,
							37,
							4,
							20,
							35,
							8,
							25,
							37,
							4,
							20,
							35,
							8,
							25,
							37,
							4,
							20
						]
					}]
				},
			};
		}
	}
</script>

<style lang="scss">
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
