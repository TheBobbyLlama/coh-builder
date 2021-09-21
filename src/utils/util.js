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