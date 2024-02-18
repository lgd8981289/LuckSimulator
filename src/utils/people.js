import { getRandomFloat } from './math'

/**
 * 返回拥有最多钱的那个人
 */
export function getWinner(arr) {
	let result = arr[0]
	arr.forEach((people) => {
		if (people.money > result.money) {
			result = people
		}
	})
	return result
}

/**
 * 返回拥有最少钱的那个人
 */
export function getLoser(arr) {
	let result = arr[0]
	arr.forEach((people) => {
		if (result.money > people.money) {
			result = people
		}
	})
	return result
}

export function createPeople(length) {
	const data = []
	for (let i = 0; i < length; i++) {
		data.push({
			// 唯一标识，作为区分
			id: i + 1,
			// 钱
			money: 100,
			// 年龄
			age: 20,
			// 能力：0.6 及格
			ability: getRandomFloat(0.3, 0.9),
			// 位置 0-1 之间
			location: {
				x: getRandomFloat(0, 0.98),
				y: getRandomFloat(0, 0.96)
			},
			// 好运数量
			goodNum: 0,
			// 抓住的好运数量
			obtainGoodNum: 0,
			// 坏运数量
			badNum: 0,
			// 图标
			record: []
		})
	}
	return data
}
