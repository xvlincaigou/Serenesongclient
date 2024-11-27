/**
 * 检查所提供的词内容数组是否符合给定词牌的平仄和韵律规则。
 *
 * @param {Array} ciContentArray - 一个包含词内容（每个元素为一个字）的数组。
 * @param {cipai} cipai - 一个表示词牌的对象，其中包含了格式化的调式信息。
 * 
 * @returns {Array<boolean>} 返回一个布尔值数组，表示每个检查点的结果。
 */

export function check(ciContentArray, cipai){
	let isValid = [];
	let possibleRhythms = []; // 这个是截止到目前位置可以使用的韵
	const tunes = cipai.format.tunes;
	
	for (let i = 0; i < ciContentArray.length; ++ i) {
		// 检查是否平仄符合
		const tune = xxx.pingze[ciContentArray[i]];
		const exactTune = tunes[i]['tune'];
		if (tune != '多' && tune != exactTune) {
			isValid.push(false);
			continue;
		}
		
		// 检查是否符合押韵
		const rhythms = xxx.rhymes[ciContentArray[i]].map(entry => entry.Rhyme);
		const rhythmType = tunes[i]['rhythm']
		if (rhythmType && rhythmType == '韵') {
			// 如果possibleRhythms为空，直接使用当前字的韵部
			if (possibleRhythms.length === 0) {
				possibleRhythms = currentRhythms;
			} else {
				// 求交集
				const consistentRhythms = possibleRhythms.filter(rhythm => 
					currentRhythms.includes(rhythm)
				);
				// 如果没有共同的韵部，说明不合格
				if (consistentRhythms.length === 0) {
					isValid.push(false);
					continue;
				} else {
					// 如果有，那么说明是合格的，我们要更新一下可能的韵
					possibleRhythms = consistentRhythms;
				}
			}
		}
		isValid.push(true);
	}
	return isValid;
}