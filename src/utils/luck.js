import { getRandomFloat } from './math'

export const updateLuck = (arr) => {
	for (let i = 0; i < arr.length; i++) {
		const luck = arr[i]
		luck.location = {
			x: getRandomFloat(0, 0.98),
			y: getRandomFloat(0, 0.96)
		}
	}
}

/**
 * @param {type} 'good || bad'
 */
export const createLuck = (length, type) => {
	const data = []
	for (let i = 0; i < length; i++) {
		data.push({
			// 唯一标识，作为区分
			id: type + i,
			type: type,
			// 位置 0-1 之间
			location: {
				x: getRandomFloat(0, 0.98),
				y: getRandomFloat(0, 0.96)
			}
		})
	}
	return data
}

/**
 * 计算财富比例
 */
export function calculatePercentageFor80Percent(peoples) {
	// 首先对people按照money从大到小排序
	peoples.sort((a, b) => b.money - a.money)

	// 计算总money
	let totalMoney = peoples.reduce((sum, person) => sum + person.money, 0)

	// 计算80%的money
	let eightyPercentMoney = 0.8 * totalMoney

	// 遍历数组，累加money直到达到或超过80%的money
	let sumMoney = 0
	let numPeople = 0
	for (let person of peoples) {
		sumMoney += person.money
		numPeople++
		if (sumMoney >= eightyPercentMoney) {
			break
		}
	}

	// 计算所占百分比
	let percentage = (numPeople / peoples.length) * 100
	return percentage
}
