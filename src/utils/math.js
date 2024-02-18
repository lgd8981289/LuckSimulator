// 生成指定范围内的随机小数
export function getRandomFloat(min, max) {
	return (Math.random() * (max - min) + min).toFixed(2)
}
