import { findPower, setIOAlreadyPlaced } from "./util";

export const displayNameSort = (a, b, path="") => 
{
	if (path) {
		var pathParts = path.split('.');

		pathParts.forEach(branch => {
			a = a[branch];
			b = b[branch];
		});
	}

	if (a.DisplayName < b.DisplayName) {
		return -1;
	} else if (a.DisplayName > b.DisplayName) {
		return 1;
	} else {
		return 0;
	}
};

export const clearCharacterData = (state) => {
	delete state.characterName;
	delete state.archetype;
	delete state.origin
	delete state.primaryPowerset;
	delete state.secondaryPowerset;
	delete state.epicPool;
	state.powers = {};
	state.pools = [];
	state.slotCount = 0;
};

export const checkAddSupplementalPowers = (addPower, state) => {
	const addPowersets = state.powersetData.filter(set => set.Powers.find(item => item.Requires?.NPowerID?.find(curReq => curReq.indexOf(addPower.PowerIndex) > -1)));

	const addMe = [];

	addPowersets.forEach(set => {
		let curAdd = set.Powers.filter(item => ((item.Level <= 1) && (item.Requires?.NPowerID?.find(curReq => curReq.indexOf(addPower.PowerIndex) > -1))));
		addMe.push(...curAdd);
	});

	addMe.forEach(curPower => {
		let curData = { powerData: curPower, active: false };

		if (curData.Slottable) {
			curData.slots = [undefined];
		}

		state.powers["Power_" + curPower.PowerIndex] = curData;
	});
}

export const checkRemoveSupplementalPowers = (remPower, state) => {
	Object.entries(state.powers).forEach(info => {
		if (info[0].startsWith("Power_")) {
			let useCount = 0;

			Object.entries(state.powers).forEach(tryMe => {
				if ((tryMe[1].powerData?.PowerIndex !== remPower.PowerIndex) && (info[1].powerData?.Requires?.NPowerID?.find(curReq => curReq.indexOf(tryMe[1].powerData?.PowerIndex) > -1))) {
					useCount++;
				}
			});

			if (useCount <= 0) {
				if ((info[1].powerData.Slottable) && (info[1].slots?.length > 1)) {
					state.slotCount = state.slotCount + 1 - info[1].slots.length;
				}

				delete state.powers[info[0]];
			}
		}
	});
}

const addDefaultInherents = (state) => {
	state.miscData.IncludeInherents.forEach(item => {
		let curPower = findPower(item, state.powersetData);

		if (curPower) {
			state.powers["Inherent_" + curPower.PowerName] = { powerData: curPower };

			if (curPower.Effects?.find(effect => ((effect.ToWho === 2) || (effect.ToWho === 3)))) {
				state.powers["Inherent_" + curPower.PowerName].active = !curPower.EndCost;
			}

			if (curPower.Slottable) {
				state.powers["Inherent_" + curPower.PowerName].slots = [ undefined ];
			}
		}
	})
}

export const setArchetype = (state, archetype) => {
	clearCharacterData(state);

	if (archetype) {
		state.archetype = archetype;

		if (archetype.Origin?.length) {
			state.origin = archetype.Origin[0];
		}

		state.powers = {};
		addDefaultInherents(state);

		let powerInfo = state.miscData.ATInherents[archetype.DisplayName];
		let curPower = findPower(powerInfo.power, state.powersetData);

		state.powers["AT_" + archetype.DisplayName] = { powerData: curPower, active: powerInfo.active };

		state.primaryPowerset = state.powersetData.find(item => item.GroupName === state.archetype.PrimaryGroup);
		state.secondaryPowerset = state.powersetData.find(item => item.GroupName === state.archetype.SecondaryGroup);

		if (state.secondaryPowerset) {
			let curData = { label: 1.1, powerData: state.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }

			if (curData.powerData.Effects?.find(effect => ((effect.ToWho === 2) || (effect.ToWho === 3)))) {
				curData.active = !curData.powerData.RechargeTime;
			}

			state.powers["Level_1.1"] = curData;
		}
	}
}

export const selectPrimaryPowerset = (state, powerset) => {
	if (state.primaryPowerset) {
		Object.entries(state.powers).forEach(info => {
			if (info[1].powerData.PowerSetID === state.primaryPowerset.nID) {
				checkRemoveSupplementalPowers(info[1].powerData, state);

				if ((info[1].powerData.Slottable) && (info[1].slots?.length > 1)) {
					state.slotCount = state.slotCount + 1 - info[1].slots.length;
				}

				delete state.powers[info[0]];
			}
		})
	}

	if ((state.archetype) && (powerset)) {
		state.primaryPowerset = powerset;
	} else {
		delete state.primaryPowerset;
	}
}

export const selectSecondaryPowerset = (state, powerset) => {
	if (state.secondaryPowerset) {
		Object.entries(state.powers).forEach(info => {
			if (info[1].powerData.PowerSetID === state.secondaryPowerset.nID) {
				checkRemoveSupplementalPowers(info[1].powerData, state);

				if ((info[1].powerData.Slottable) && (info[1].slots?.length > 1)) {
					state.slotCount = state.slotCount + 1 - info[1].slots.length;
				}

				delete state.powers[info[0]];
			}
		})
	}

	if ((state.archetype) && (powerset)) {
		state.secondaryPowerset = powerset;

		let curData = { label: 1.1, powerData: state.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }

		if (curData.powerData.Effects?.find(effect => ((effect.ToWho === 2) || (effect.ToWho === 3)))) {
			curData.active = !curData.powerData.RechargeTime;
		}

		state.powers["Level_1.1"] = curData;
	} else {
		delete state.secondaryPowerset;
	}
}

export const selectPower = (state, power, level) => {
	const levelKey = "Level_" + level;

	if (state.powers[levelKey]) {
		checkRemoveSupplementalPowers(state.powers[levelKey].powerData, state);

		if ((state.powers[levelKey].powerData?.Slottable) && (state.powers[levelKey].slots?.length > 1)) {
			state.slotCount = state.slotCount + 1 - state.powers[level].slots.length;
		}

		if (state.powers[levelKey].powerData.GroupName === "Pool") {
			let powerCount = Object.entries(state.powers).filter(item => item[1].powerData.PowerSetID === state.powers[levelKey].powerData.PowerSetID).length;

			if (powerCount <= 1) {
				let poolIndex = state.pools.findIndex(item => item.nID === state.powers[levelKey].powerData.PowerSetID);

				if (poolIndex > -1) {
					state.pools.splice(poolIndex, 1);
				}
			}
		} else if (state.powers[levelKey].powerData.GroupName === "Epic") {
			let powerCount = Object.entries(state.powers).filter(item => item[1].powerData.PowerSetID === state.powers[levelKey].powerData.PowerSetID).length;

			if (powerCount <= 1) {
				delete state.epicPool;
			}
		}
	}

	if (power?.PowerIndex > 0) {
		// Clear out the power if we have it selected somewhere else.
		for (const [key, value] of Object.entries(state.powers)) {
			if (value?.powerData?.PowerIndex === power.PowerIndex) {
				delete state.powers[key];
			}
		}

		if (power.GroupName === "Pool") {
			var selectedPool = state.pools.find(curPool => curPool.nID === power.PowerSetID);

			if (!selectedPool) {
				selectedPool = state.powersetData.find(mySet => mySet.nID === power.PowerSetID);
				state.pools.push(selectedPool);
				state.pools.sort(displayNameSort);
			}
		} else if (power.GroupName === "Epic") {
			if (!state.epicPool) {
				state.epicPool = state.powersetData.find(mySet => mySet.nID === power.PowerSetID);
			} else if (state.epicPool.nID !== power.PowerSetID) {
				return "Cannot add an epic power from another pool!";
			}
		}

		let curData = { label: level, powerData: power };

		if (power.Slottable) {
			curData.slots = [ undefined ];
		}

		if (power.Effects?.find(effect => ((effect.ToWho === 2) || (effect.ToWho === 3)))) {
			curData.active = !power.RechargeTime;
		}

		state.powers[levelKey] = curData;

		checkAddSupplementalPowers(power, state);

		return false;
	}

	delete state.powers[levelKey]; // This is after all the other logic to ensure bad data is cleaned up.
	return false;
}

export const applyEnhancementToPower = (state, powerInfo, enhancement, slotIndex) => {
	if ((enhancement) && (slotIndex < powerInfo?.slots?.length)) {
		switch (enhancement.TypeID) {
			case -1:
				switch (enhancement.SpecialText) {
					case "Clear":
						powerInfo.slots[slotIndex] = undefined;
						break;
					case "Remove":
						powerInfo.slots.splice(slotIndex, 1);
						state.slotCount--;
						break;
					default:
						break;
				}
				break;
			default:
				let placed = setIOAlreadyPlaced(enhancement, state.powers, powerInfo, slotIndex);

				if (placed) {
					state.powers[placed[0]].slots[placed[1]] = undefined;
				}

				powerInfo.slots[slotIndex] = enhancement;
				break;
		}
	}
}

export const selectAccolade = (state, accolade, index) => {
	if (accolade) {
		state.powers["Accolade_" + index] = { powerData: accolade, active: !accolade.RechargeTime };
	} else {
		delete state.powers["Accolade_" + index];
	}
}

export const selectIncarnate = (state, incarnate, set) => {
	if (incarnate) {
		state.powers["Incarnate_" + set] = { powerData: incarnate, active: !incarnate.RechargeTime };
	} else {
		delete state.powers["Incarnate_" + set];
	}
}