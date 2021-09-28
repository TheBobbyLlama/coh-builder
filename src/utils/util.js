export const findPower = (powerName, powersetData) => {
	return powersetData.find(set => set.Powers.find(power => power.FullName === powerName))?.Powers.find(power => power.FullName === powerName);
}

export const validPoolPower = (tryPower, tryLevel, powerList) => {
	var testEntries = Object.entries(powerList).filter(curItem => Number(curItem[0]) < Number(tryLevel)).map(curItem => curItem[1].powerData.PowerIndex);
	var checkArray = tryPower.Requires.NPowerID;

	if (checkArray.length) {
		for (var i = 0; i < checkArray.length; i++) {
			let count = 0;

			for (let x = 0; x < checkArray[i].length; x++) {
				if ((checkArray[i][x] === -1) || (testEntries.indexOf(checkArray[i][x]) > -1)) {
					count++;
				}
			}

			if (count === checkArray[i].length) {
				return true;
			}
		}

		return false;
	} else {
		return true;
	}
};

export const setIOAlreadyPlaced = (enhancement, powerList, curPower, slotIndex, debug=false) => {
	if (enhancement?.TypeID === 4) {
		if (enhancement.Unique) {
			for (const [, value] of Object.entries(powerList)) {

				if (value?.slots) {
					let findSlot = value.slots.findIndex(item => ((item) && (item.StaticIndex === enhancement?.StaticIndex)));

					if ((findSlot > -1) && ((value.label !== curPower.label) || (findSlot !== slotIndex))) {
						return [value.label, findSlot];
					}
				}
			}

			return false;
		} else {
			let findSlot = curPower.slots.findIndex(item => ((item) && (item.StaticIndex === enhancement?.StaticIndex)));
			
			if ((findSlot > -1) && (findSlot !== slotIndex)) {
				return [curPower.label, findSlot];
			} else {
				return false;
			}
		}
	} else {
		return false;
	}
};