<template>
	<div class="chart-box" ref="boxEle"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
	data: {
		type: Array,
		default: () => []
	}
})

const boxEle = ref()
let myChart
onMounted(() => {
	myChart = echarts.init(boxEle.value)
})

function updateChart() {
	if (!myChart) return
	myChart.setOption({
		grid: {
			top: 10,
			right: 10,
			bottom: 0,
			left: 0,
			// 计算边距时，包含标签
			containLabel: true
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			data: props.data.map((item) => item.age)
		},
		yAxis: {
			type: 'value'
		},
		series: {
			data: props.data.map((item) => item.money),
			type: 'line'
		}
	})
}

watch(() => props.data, updateChart, {
	immediate: true,
	deep: true
})
</script>

<style lang="scss" scoped>
.chart-box {
	width: 380px;
	height: 200px;
}
</style>
