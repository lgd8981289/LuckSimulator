<template>
	<div class="container">
		<div class="render">
			<m-svg-icon
				class="people"
				:style="{
					top: people.location.y * 100 + '%',
					left: people.location.x * 100 + '%'
				}"
				v-for="people in peoples"
				:key="people.id"
				name="people"
			></m-svg-icon>

			<span
				class="good"
				:style="{
					top: goodLuck.location.y * 100 + '%',
					left: goodLuck.location.x * 100 + '%'
				}"
				v-for="goodLuck in goodLucks"
				:key="goodLuck.id"
			></span>

			<span
				class="bad"
				:style="{
					top: badLuck.location.y * 100 + '%',
					left: badLuck.location.x * 100 + '%'
				}"
				v-for="badLuck in badLucks"
				:key="badLuck.id"
			></span>
		</div>
		<div class="control">
			<div class="rule desc">
				<div class="">
					规则：
					<br />
					1、人不移动，运气会移动。运气的移动并不是连续的
					<br />
					2、人与运气坐标一致时，则表示【人遇到了运气】
					<br />
					3、运气分为好运气和坏运气：遭遇好运气，人的财富会根据能力进行翻倍，能力（0.3-0.9之间）越高翻倍的概率越大（1表示100%）。遭遇坏运气，人的财富会被砍半，这将与能力无关
					<br />
					4、人从20岁开始工作，到60岁结束，中间经历 40
					年。运气将模拟这40年的经历，每 500ms 表示一年
					<br />
					5、让我们拭目以待，20 秒之后，财富最高者是否为能力最强者！
				</div>
				<div class="rule-title">
					<span class="good mr"></span> 好运气（{{ luckLength }}个）
					<span class="bad ml mr"></span> 坏运气（{{ luckLength }}个）
					<m-svg-icon class="people ml mr" name="people"></m-svg-icon> 人（{{
						peopleLength
					}}位）
				</div>
			</div>
			<div class="mt">时间流逝：{{ count }} 年</div>
			<div class="box">
				<div class="mt">
					人的数量：<input
						class="input-number"
						type="number"
						v-model="peopleLength"
					/>
					<br />
					运气数量：<input
						class="input-number mt"
						type="number"
						v-model="luckLength"
					/>
				</div>

				<button
					class="button mt ml"
					:class="{ disabled: loading }"
					:disabled="loading"
					@click="start"
				>
					开始
				</button>
			</div>
			<div class="winner mt">
				<div>
					<span class="text-2x">获胜者</span>
					能力:{{ winner.ability }} 财富:{{ winner.money }}
				</div>
				<m-line-chart :data="winner.record"></m-line-chart>
			</div>
			<div class="loser mt">
				<div>
					<span class="text-2x">失败者</span> 能力:{{ loser.ability }} 财富:{{
						loser.money
					}}
				</div>
				<m-line-chart :data="loser.record"></m-line-chart>
			</div>
		</div>
	</div>
</template>

<script setup>
import { createPeople, getWinner, getLoser } from '@/utils/people'

import {
	createLuck,
	updateLuck,
	calculatePercentageFor80Percent
} from '@/utils/luck'
import { getRandomFloat } from '@/utils/math'
import { ref } from 'vue'
// 人的数量
const peopleLength = ref(500)
const peoples = ref({})
// 拥有钱最多的人
const winner = ref({})
// 拥有钱最少的人
const loser = ref({})

// 运气的数量
const luckLength = ref(500)
const goodLucks = ref({})
const badLucks = ref({})

// 时间的变化
const MAX = 40
let count = ref(0)

const init = () => {
	peoples.value = createPeople(peopleLength.value)
	goodLucks.value = createLuck(luckLength.value, 'good')
	badLucks.value = createLuck(luckLength.value, 'bad')
	winner.value = {}
	loser.value = {}
	count.value = 0
}
init()

/**
 * 规则：
 * 1、人（people）不移动，运气（luck）会移动运气的移动并不是连续的
 * 2、人与运气坐标一致时，则表示 人遭遇了运气
 * 3、运气分为好运气和坏运气：遭遇好运气，人的财富会根据能力进行翻倍，能力越高翻倍的概率越大（1表示100%）。遭遇坏运气，人的财富会被砍半，这将与能力无关
 * 4、人从20岁开始工作，到60岁结束，中间经历 40 年。运气将模拟这40年的经历，每 500ms 表示一年，共 20 秒走完这一生的流程。
 * 5、让我们拭目以待，20 秒之后，财富最高者是否为能力最强者！
 *
 */
let interval = null
// 是否在计算中
const loading = ref(false)
const start = () => {
	init()
	loading.value = true
	interval = setInterval(() => {
		if (count.value === MAX) {
			return end()
		}
		match()
		updateLuck(goodLucks.value)
		updateLuck(badLucks.value)
		count.value += 1
	}, 500)
}

const end = () => {
	statistics()
	loading.value = false
	clearInterval(interval)
}

/**
 * 计算运气
 */
const match = () => {
	peoples.value.forEach((people) => {
		// 判断好运气
		goodLucks.value.forEach((luck) => {
			if (
				people.location.x === luck.location.x &&
				people.location.y === luck.location.y
			) {
				// 好运 +1
				people.goodNum += 1
				// 根据随机数判断能力
				if (people.ability > getRandomFloat(0, 1)) {
					// 抓住的好运 +1
					people.obtainGoodNum += 1
					people.money = people.money * 2
				}
			}
		})
		// 判断坏运气
		badLucks.value.forEach((luck) => {
			if (
				people.location.x === luck.location.x &&
				people.location.y === luck.location.y
			) {
				// 坏运 +1
				people.badNum += 1
				people.money = people.money / 2
			}
		})
		people.age += 1
		people.record.push({
			age: people.age,
			money: people.money
		})
	})
}

/**
 * 统计数据
 */
const statistics = () => {
	winner.value = getWinner(peoples.value)
	console.log(`获胜者：\n 好运气数量:${winner.value.goodNum}
					\n 抓住的好运气数量:${winner.value.obtainGoodNum}
					\n 坏运气数量：${winner.value.badNum}
					\n 能力：${winner.value.ability}
					\n 财富：${winner.value.money}`)
	loser.value = getLoser(peoples.value)
	console.log(`失败者：\n 好运气数量:${loser.value.goodNum}
					\n 抓住的好运气数量:${loser.value.obtainGoodNum}
					\n 坏运气数量：${loser.value.badNum}
					\n 能力：${loser.value.ability}
					\n 财富：${loser.value.money}`)

	console.log(
		`财富分布：
			\n 财富 10 以下人数：${peoples.value.filter((item) => item.money < 10).length}
			\n 财富 10 - 100 人数：${
				peoples.value.filter((item) => item.money > 10 && item.money < 100)
					.length
			}
			\n 财富 100 - 500 人数：${
				peoples.value.filter((item) => item.money > 100 && item.money < 500)
					.length
			}
			\n 财富 500 - 1000 人数：${
				peoples.value.filter((item) => item.money > 500 && item.money < 1000)
					.length
			}
			\n 财富 1000 - 2000 人数：${
				peoples.value.filter((item) => item.money > 1000 && item.money < 2000)
					.length
			}
			\n 财富 2000 - 5000 人数：${
				peoples.value.filter((item) => item.money > 2000 && item.money < 5000)
					.length
			}
			\n 财富 5000 以上 人数：${
				peoples.value.filter((item) => item.money > 5000).length
			}
			\n 财富的 80 % 掌握在 ${calculatePercentageFor80Percent(peoples.value)}% 人手中
		`
	)
}
</script>

<style lang="scss" scoped>
.good {
	background-color: red;
	width: 10px;
	height: 10px;
	border-radius: 100%;
	display: inline-block;
}

.bad {
	background-color: green;
	width: 10px;
	height: 10px;
	border-radius: 100%;
	display: inline-block;
}

.people {
	width: 15px;
	height: 15px;
}

.container {
	height: 100vh;
	box-sizing: border-box;
	background-color: rgb(240, 240, 240);
	padding: 10px;
	display: flex;
	.render {
		height: calc(100vh - 20px);
		border: 1px solid black;
		position: relative;
		margin-right: 10px;
		flex-grow: 1;
		.people {
			position: absolute;
		}

		.good {
			position: absolute;
		}

		.bad {
			position: absolute;
		}
	}

	.control {
		width: 380px;

		.rule-title {
			display: flex;
			align-items: center;
		}

		.desc {
			font-size: 13px;
			color: #999;
		}

		.box {
			display: flex;
		}

		.winner {
			font-size: 20px;
			font-weight: bold;
			color: red;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.18);
		}

		.loser {
			font-size: 20px;
			font-weight: bold;
			color: green;
			text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.18);
		}
	}
}
</style>
