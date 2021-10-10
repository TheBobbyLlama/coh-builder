import pako from "pako";
import { toByteArray, fromByteArray } from "base64-js";

import { findPower, findPowerID } from "./util";
import { displayNameSort, checkAddSupplementalPowers, setArchetype, selectPrimaryPowerset, selectSecondaryPowerset, selectIncarnate } from "./characterUtils";

// https://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin

// Convert a hex string to a byte array
const hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
};

// Convert a byte array to a hex string
const bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
};

const readBool = (bytes, position) => {
	if (position >= bytes.length) {
		throw new RangeError("Invalid data format.");
	}

	if (bytes[position]) {
		return [true, position + 1];
	} else {
		return [false, position + 1];
	}
}

const writeBool = (bytes, input) => {
	bytes.push((input) ? 1 : 0);
}

const readFloat = (bytes, position) => {
	if (position >= bytes.length) {
		throw new RangeError("Invalid data format.");
	}

	return [1.00, position + 4];
}

/*const writeFloat = (bytes, input) => {
	// HACK - Currently only pushing 1.01 for the save version!
	bytes.push(174);
	bytes.push(71);
	bytes.push(129);
	bytes.push(63);
}*/

const readInt = (bytes, position) => {
	if (position >= bytes.length) {
		throw new RangeError("Invalid data format.");
	}

	const inputData = [bytes[position], bytes[position + 1], bytes[position + 2], bytes[position + 3]];

	if (inputData[3] === 255) {
		return [-1, position + 4];
	} else {
		let multiplier = 1;
		let result = 0;

		for (var i = 0; i < inputData.length; i++) {
			result += multiplier * inputData[i];
			multiplier *= 256;
		}

		return [result, position + 4];
	}
}

const writeInt = (bytes, input) => {
	if (input < 0) { // Cheese it with a -1 value.
		bytes.push(255);
		bytes.push(255);
		bytes.push(255);
		bytes.push(255);
	} else {
		for (var i = 0; i < 4; i++) {
			bytes.push(input & 255);
			input = Math.floor(input / 256);
		}
	}
}

const readSByte = (bytes, position) => {
	if (position >= bytes.length) {
		throw new RangeError("Invalid data format.");
	}

	if (bytes[position]  > 127) {
		return [bytes[position] - 256, position + 1];
	} else {
		return [bytes[position], position + 1];
	}
}

const writeSByte = (bytes, input) => {
	bytes.push(input);
}

const readString = (bytes, position) => {
	if (position >= bytes.length) {
		throw new RangeError("Invalid data format.");
	}

	let strLen;
	let result = "";

	[strLen, position] = readSByte(bytes, position);

	for (var i = 0; i < strLen; i++) {
		result += String.fromCharCode(bytes[position + i]);
	}

	return [result, position + strLen];
}

const writeString = (bytes, input) => {
	if (input) {
		bytes.push(input.length);

		for (var i = 0; i < input.length; i++) {
			bytes.push(input.charCodeAt(i));
		}
	} else {
		bytes.push(0);
	}
}

export const getDataChunk = (input) => {
	// MIDS REBORN EXPORT URL
	// URL params: uc - Size Uncompressed, c - Size Compressed, a - Size Encoded, dc - Encoded Data
	let testMe = input.match(/(?:.*\?.*.*a=(.+?)&.+dc=)(.*)$/);

	if (testMe?.length === 3) {
		// Validate length
		if (testMe[2].length === Number(testMe[1])) {
			return testMe[2];
		} else {
			return false;
		}
	}

	// MIDS DATA CHUNK
	testMe = input.match(/(?:\|-+\|\n\|MxD.+;(\d+);HEX;\|\n)((?:\|\w+\|\n)+)(?:\|-+\|)/);

	if (testMe?.length === 3) {
		testMe[2] = testMe[2].replace(/\||\n/g, "");
		// Validate length
		if (testMe[2].length === Number(testMe[1])) {
			return testMe[2];
		} else {
			return false;
		}
	}

	// COH BUILDER LINK
	testMe = input.match(/(?:.*\/load\?data=)(.*)$/);

	if (testMe?.length === 2) {
		return testMe[1];
	}

	return false;
}

const readSlotData = (data, position, curPower, state, qualifiedNames) => {
	let result;
	let tmpData;

	if (qualifiedNames) {
		[tmpData, position] = readString(data, position);
		result = state.enhancementData.find(enh => enh.UID === tmpData);
	} else {
		[tmpData, position] = readInt(data, position);
		result = state.enhancementData.find(enh => enh.StaticIndex === tmpData);
	}

	if (result) {
		if (result.TypeID) {
			[, position] = readSByte(data, position); // Relative level OR IO level
			[, position] = readSByte(data, position); // Grade OR relataive level
		}
	}

	return [result, position];
}

const writeSlotData = (data, enhancement, state) => {
	if (enhancement) {
		writeInt(data, enhancement.StaticIndex);

		switch (enhancement.TypeID) {
			case 1:
			case 3:
				writeSByte(data, 4); // Relative level +0 (4 in the Mids enum)
				writeSByte(data, 3); // SO
				break;
			case 2:
			case 4:
				let maxLevel = state.enhancementData.find(set => set.Uid === enhancement.UIDSet)?.LevelMax || 49;
				writeSByte(data, maxLevel); // IO level - Always set to max!
				writeSByte(data, 4); // Relative level +0 (4 in the Mids enum)
				break;
			default:
				break;
		}
	} else {
		writeInt(data, -1);
	}
}

const readEnhancements = (data, position, curPower, state, qualifiedNames) => {
	let slotCount;
	let slots;

	[slotCount, position] = readSByte(data, position);
	slotCount++;

	if ((slotCount < 0) || (slotCount > 6)) {
		throw new RangeError("Invalid data format.");
	}

	if (slotCount) {
		slots = [];

		for (let i = 0; i < slotCount; i++) {
			let altEnh;

			[, position] = readSByte(data, position); // Level (placed level)
			[slots[i], position] = readSlotData(data, position, curPower, state, qualifiedNames);
			[altEnh, position] = readBool(data, position); // Include alternate enhancement?

			// Discard any alternate enhancement info!!!
			if (altEnh) {
				[, position] = readSlotData(data, position, curPower, state, qualifiedNames);
			}
		}
	}

	return [slots, position];
}

const writeEnhancements = (data, slots, state) => {
	if (!slots?.length) {
		writeSByte(data, -1);
	} else {
		writeSByte(data, slots.length - 1);
		
		for (let i = 0; i < slots.length; i++) {
			writeSByte(data, 49); // Placed level	TODO - Will this work???
			writeSlotData(data, slots[i], state);
			writeBool(data, false); // includeAltEnh - Always false!
		}
	}
}

const readPower = (data, position, state, qualifiedNames) => {
	let curPower;
	let tmpData;
	let tmpIdx = -1;
	let tmpLevel;
	let statInclude;
	let variableValue;
	let slots;

	if (qualifiedNames) {
		[tmpData, position] = readString(data, position);
		curPower = findPower(tmpData, state.powersetData);
	} else {
		[tmpIdx, position] = readInt(data, position);
		curPower = findPowerID(tmpIdx, state.powersetData);
	}

	if ((curPower) || (tmpIdx > -1)) {
		let tmpSubs;
		[tmpLevel, position] = readSByte(data, position);
		tmpLevel++;
		[statInclude, position] = readBool(data, position);
		[variableValue, position] = readInt(data, position);

		[tmpSubs, position] = readSByte(data, position);
		tmpSubs++;

		// Discard subpowers!
		if (tmpSubs) {
			for (let x = 0; x < tmpSubs; x++) {
				let tmpPower;

				if (qualifiedNames) {
					[tmpPower, position] = readString(data, position);
					tmpPower = findPower(tmpPower, state.powersetData);
				} else {
					[tmpPower, position] = readInt(data, position);
					tmpPower = findPowerID(tmpPower, state.powersetData);
				}

				[, position] = readBool(data, position); // StatInclude
			}
		}
	}

	[slots, position] = readEnhancements(data, position, curPower, state);

	if (curPower) {
		let ownerSet = state.powersetData.find(set => set.Powers.find(pwr => pwr.StaticIndex === curPower.StaticIndex));
		let backupSet = state.powersetData.find(set => ((set.SetType === ownerSet.SetType) && (state.miscData.ATExclusionList[state.archetype.DisplayName]?.find(tmpSet => tmpSet === set.FullName))));

		if (ownerSet) {
			// STEP 1 - Validate powers!
			switch (ownerSet.SetType) {
				case 1: // Primary
					if ((ownerSet.nID !== state.primaryPowerset.nID) && (backupSet?.nID !== ownerSet.nID)) {
						console.log("Invalid power: " + curPower.DisplayName);
						return position;
					}
					break;
				case 2: // Secondary
					if ((ownerSet.nID !== state.secondaryPowerset.nID) && (backupSet?.nID !== ownerSet.nID)) {
						console.log("Invalid power: " + curPower.DisplayName);
						return position;
					}

					if (tmpLevel === 1) {
						tmpLevel = 1.1;
					}
					break;
				case 3: // Ancillary
					if (ownerSet.nID !== state.epicPool?.nID) {
						console.log("Invalid power: " + curPower.DisplayName);
						return position;
					}
					break;
				case 5: // Pool
					if (!state.pools.find(pool => pool.nID === ownerSet.nID)) {
						console.log("Invalid power: " + curPower.DisplayName);
						return position;
					}
					break;
				case 6: // Accolade
					if (!state.miscData.Accolades.find(item => item[0] === curPower.FullName || item[1] === curPower.FullName)) {
						console.log("Discarding accolade " + curPower.DisplayName);
						return position;
					}
					break;
				default:
					break;
			}

			let powerInfo;

			// STEP 2 - Apply powers!
			switch (ownerSet.SetType) {
				case 1: // Primary
				case 2: // Secondary
				case 3: // Ancillary
				case 5: // Pool
					if ((!state.powers["Level_" + tmpLevel]) || (tmpLevel === 1.1)) {
						powerInfo = { label: tmpLevel, powerData: curPower };

						if (curPower.Slottable) {
							powerInfo.slots = slots || [ undefined ];
							state.slotCount += powerInfo.slots.length - 1;
						}

						if (curPower.Effects?.find(effect => ((effect.ToWho === 2) || (effect.ToWho === 3)))) {
							powerInfo.active = statInclude;
						}

						state.powers["Level_" + tmpLevel] = powerInfo;

						checkAddSupplementalPowers(curPower, state);
					} else {
						let tmpPower = state.powers["Power_" + curPower.PowerIndex];

						if (tmpPower) {
							if (slots) {
								tmpPower.slots = slots;
							}

							if (statInclude) {
								tmpPower.active = true;
							}
						}
					}
					break;
				case 4: // Inherent
					powerInfo = state.powers["Inherent_" + curPower.PowerIndex];

					if (powerInfo) {
						if (curPower.Slottable) {
							powerInfo.slots = slots || [ undefined ];
							state.slotCount += powerInfo.slots.length - 1;
						}
					} else {
						powerInfo = state.powers["Power_" + curPower.PowerIndex];

						if ((powerInfo) && (curPower.Slottable)) {
							powerInfo.slots = slots || [ undefined ];
							state.slotCount += powerInfo.slots.length - 1;
						}
					}
					break;
				case 6: // Accolade
					let accoladeEntry = state.miscData.Accolades.findIndex(item => item[0] === curPower.FullName || item[1] === curPower.FullName);

					powerInfo = {powerData: findPower(state.miscData.Accolades[accoladeEntry][(state.theme === "Villain") ? 1 : 0], state.powersetData), active: true};
					state.powers["Accolade_" + accoladeEntry] = powerInfo;
					break;
				case 11: // Incarnate
					selectIncarnate(state, curPower, ownerSet.DisplayName);
					break;
				default:
					break;
			}
		}
	}

	return position;
}

const writePower = (data, powerInfo, state) => {
	if (powerInfo?.powerData) {
		let level = Math.floor((powerInfo.label || 1) - 1);

		writeInt(data, powerInfo.powerData.StaticIndex);
		writeSByte(data, level);
		writeBool(data, !!powerInfo.active);
		writeInt(data, 0); // TODO - VariableValue!
		writeSByte(data, -1); // SubPower count - Always -1/none!
		writeEnhancements(data, powerInfo.slots, state);
	} else {
		writeInt(data, -1);
	}
}

export const importCharacter = (dataStream, state) => {
	let data;

	try {
		let ucData;

		if (dataStream.charCodeAt(0) === 64) { // '@'
			ucData = toByteArray(dataStream.substr(1));
		} else {
			ucData = hexToBytes(dataStream);
		}

		data = pako.inflate(ucData);
	} catch (e) {
		return "Character data could not be decompressed: " + e;
	}

	try {
		let position = 0;
		let tmpData;
		let tmpCnt;

		let qualifiedNames;

		// Check "MagicNumber" - 'M', 'x', 'D', 12
		if ((data[position++] !== 77) || (data[position++] !== 120) || (data[position++] !== 68) || (data[position++] !== 12)) {
			return false;
		}

		[, position] = readFloat(data, position); // SaveVersion
		[qualifiedNames, position] = readBool(data, position); // UseQualifiedNames
		[, position] = readBool(data, position); // UseOldSubpowerFields
		[tmpData, position] = readString(data, position); // Primary powerset name

		tmpData = state.archetypeData.find(at => at.ClassName === tmpData);

		if (tmpData) {
			setArchetype(state, tmpData);
		} else {
			return "Invalid archetype."
		}

		[tmpData, position] = readString(data, position); // Origin
		state.origin = tmpData;

		[tmpData, position] = readInt(data, position); // Alignment
		state.theme = (tmpData & 1) ? "Villain" : "Hero";

		[tmpData, position] = readString(data, position); // Character Name
		state.characterName = tmpData;

		[tmpCnt, position] = readInt(data, position); // Powerset count
		tmpCnt++;

		if (tmpCnt > 0) {
			let tmpArray = [];
			let tmpSelected = [false, false, false];

			for (let i = 0; i < tmpCnt; i++) {
				let tmpValue;
				[tmpValue, position] = readString(data, position); // Powerset name

				// Check legacy names for backward compatibility.
				let tmpFind = state.miscData.LegacySetNames.find(item => item[0] === tmpValue);

				if (tmpFind) {
					tmpValue = tmpFind[1];
				}

				let tmpSet = state.powersetData.find(set => set.FullName === tmpValue);

				if (tmpSet) {
					tmpArray.push(tmpSet);
				}
			}

			for (let i = 0; i < tmpArray.length; i++) {
				switch(tmpArray[i].SetType) {
					case 1: // Primary
						selectPrimaryPowerset(state, tmpArray[i]);
						break;
					case 2: // Secondary
						// Selected automatically for VEATs, ignore it here.
						if (state.archetype.ClassType !== 4) {
							selectSecondaryPowerset(state, tmpArray[i]);
						}
						break;
					case 3: // Ancillary
						state.epicPool = tmpArray[i];
						break;
					case 5: // Pool
						if (!state.pools.find(set => set.SetName === tmpArray[i].SetName)) {
							state.pools.push(tmpArray[i]);
						}
						break;
					default:
						break;
				}

				tmpSelected[tmpArray[i].SetType] = true;
			}

			state.pools.sort(displayNameSort);

			if (!tmpArray[1]) {
				return "Character has no primary powerset.";
			} else if (!tmpArray[2]) {
				return "Character has no secondary powerset.";
			}
		} else {
			return "Character has no powers."
		}

		[, position] = readInt(data, position); // LastPower
		[tmpCnt, position] = readInt(data, position); // Powers.Count - 1

		for (let i = 0; i <= tmpCnt; i++) {
			position = readPower(data, position, state, qualifiedNames);
		}

		tmpData = Object.entries(state.powers);

		for (let i = state.pools.length - 1; i >= 0; i--) {
			if (!tmpData.find(info => info[1].powerData.PowerSetID === state.pools[i].nID)) {
				state.pools.splice(i, 1);
			}
		}
	} catch (e) {
		return e;
	}

	return false; // No errors!
}

export const exportCharacter = (state) => {
	let tmpData;
	const powerListing = Object.entries(state.powers);
	const data = [ 77, 120, 68, 12, 174, 71, 129, 63, 0, 1 ];  // MagicNumber (int), SaveVersion (float), UseQualifiedNames (bool), UseOldSubpowerFields (bool)
	writeString(data, state.archetype.ClassName);
	writeString(data, state.origin);
	writeInt(data, (state.theme === "Villain") ? 3 : 0);
	writeString(data, state.characterName);

	writeInt(data, 7);
	writeString(data, state.primaryPowerset.FullName);

	tmpData = state.powersetData.find(set => ((set.SetType === 2) && (state.miscData.ATExclusionList[state.archetype.DisplayName]?.find(tmpSet => tmpSet === set.FullName))));

	if (tmpData) {
		writeString(data, tmpData.FullName);
	} else {
		writeString(data, state.secondaryPowerset.FullName);
	}
	
	for (let i = 0; i < 4; i++) {
		if (state.pools[i]) {
			writeString(data, state.pools[i].FullName);
		} else {
			writeSByte(data, 0);
		}
	}

	if (state.epicPool) {
		writeString(data, state.epicPool.FullName);
	} else {
		writeSByte(data, 0);
	}

	writeString(data, "Inherent.Inherent");

	writeInt(data, 0); // LastPower
	writeInt(data, powerListing.length);


	for (let i = 0; i < state.miscData.PowerLevels.length; i++) {
		writePower(data, state.powers["Level_" + state.miscData.PowerLevels[i]], state);
	}

	powerListing.filter(info => info[0].startsWith("AT_")).forEach(info => {
		writePower(data, info[1], state);
	});

	powerListing.filter(info => info[0].startsWith("Inherent_")).forEach(info => {
		writePower(data, info[1], state);
	});

	powerListing.filter(info => info[0].startsWith("Power_")).forEach(info => {
		writePower(data, info[1], state);
	});

	powerListing.filter(info => info[0].startsWith("Accolade_")).forEach(info => {
		writePower(data, info[1], state);
	});

	powerListing.filter(info => info[0].startsWith("Incarnate_")).forEach(info => {
		writePower(data, info[1], state);
	});

	writePower(data, {powerData: findPower("Inherent.Inherent.Rest", state.powersetData), slots: [ undefined ]});

	const buffer = new Uint8Array(data);
	const compressMe = pako.deflate(buffer);
	const hexMe = bytesToHex(compressMe).toUpperCase();
	const base64Me = fromByteArray(compressMe);

	return { ucSize: buffer.length, cSize: compressMe.length, aSize: hexMe.length, hexData: hexMe, base64Data: base64Me };
}