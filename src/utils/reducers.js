import { useReducer } from "react";

import {
	SET_COLOR_THEME,
	SET_DATA_ENVIRONMENT,
	SET_CURRENT_PAGE,
	SHOW_MODAL,
	SELECT_ARCHETYPE,
	SET_CHARACTER_NAME,
	SELECT_ORIGIN,
	SELECT_PRIMARY_POWERSET,
	SELECT_SECONDARY_POWERSET,
	SELECT_POWER,
	ADD_SLOT_TO_POWER,
	APPLY_ENHANCEMENT_TO_POWER,
	SELECT_ACCOLADE,
	SELECT_INCARNATE,
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER
} from "./actions";

import { initializeDataset } from "../lib/db";
import { findPower, setIOAlreadyPlaced } from "./util";

const displayNameSort = (a, b, path="") => 
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

const clearCharacterData = (state) => {
	delete state.archetype;
	delete state.origin
	delete state.primaryPowerset;
	delete state.secondaryPowerset;
	delete state.epicPool;
	state.powers = {};
	state.pools = [];
	state.slotCount = 0;
};

const checkAddSupplementalPowers = (addPower, state) => {
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

const checkRemoveSupplementalPowers = (remPower, state) => {
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
			state.powers[item] = { powerData: curPower, active: !curPower.ToggleCost };

			if (curPower.Slottable) {
				state.powers[item].slots = [ undefined ];
			}
		}
	})
}

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_COLOR_THEME:
			newState =  { ...state, theme: action.theme };

			// Flip accolades to their redside/blueside counterparts
			if (newState.powers) {
				let offset = action.theme === "Villain" ? 1 : 0;

				for (let i = 0; i < state.miscData.Accolades.length; i++) {
					if (state.powers["Accolade" + i]) {
						state.powers["Accolade" + i].powerData = findPower(state.miscData.Accolades[i][offset], state.powersetData);
					}
				}
			}

			return newState;
		case SET_DATA_ENVIRONMENT:
			newState = { ...state, environment: action.environment, page: PAGE_MAIN_MENU };

			if (action.environment) {
				clearCharacterData(newState);
				[newState.archetypeData, newState.attribModData, newState.enhancementData, newState.enhancementClassData, newState.enhancementSetData, newState.powersetData, newState.miscData] = initializeDataset(action.environment);
				localStorage.setItem("environment", action.environment);
			}
			return newState;
		case SET_CURRENT_PAGE:
			return { ...state, page: action.page, theme: "Hero" };
		case SHOW_MODAL:
			newState = { ...state };

			if (action.modal) {
				newState.modal = action.modal;
			} else {
				delete newState.modal;
			}

			return newState;
		case SELECT_ARCHETYPE:
			newState = { ...state };

			clearCharacterData(newState);

			if (action.archetype) {
				newState.archetype = action.archetype;

				if (action.archetype.Origin?.length) {
					newState.origin = action.archetype.Origin[0];
				}

				newState.powers = {};
				addDefaultInherents(newState);

				let powerInfo = state.miscData.ATInherents[action.archetype.DisplayName];
				let curPower = findPower(powerInfo.power, state.powersetData);

				newState.powers[action.archetype.DisplayName] = { powerData: curPower, active: powerInfo.active };

				newState.primaryPowerset = newState.powersetData.find(item => item.GroupName === newState.archetype.PrimaryGroup);
				newState.secondaryPowerset = newState.powersetData.find(item => item.GroupName === newState.archetype.SecondaryGroup);

				if (newState.secondaryPowerset) {
					let curData = { label: 1.1, powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }

					if (curData.powerData.Effects?.find(effect => effect.ToWho === 2)) {
						curData.active = !curData.powerData.RechargeTime;
					}

					newState.powers[1.1] = curData;
				}

				newState.theme = newState.archetype.Hero ? "Hero" : "Villain";
				newState.page = PAGE_CHARACTER_DESIGNER;
			} else {
				delete newState.modal;
				newState.page = PAGE_MAIN_MENU;
				newState.theme = "Hero";
			}

			return newState;
		case SET_CHARACTER_NAME:
			newState = { ...state };

			if (action.name) {
				newState.characterName = action.name;
			} else {
				newState.characterName = "";
			}

			return newState;
		case SELECT_ORIGIN:
			return { ...state, origin: action.origin };
		case SELECT_PRIMARY_POWERSET:
			newState = { ...state };

			if (newState.primaryPowerset) {
				Object.entries(newState.powers).forEach(info => {
					if (info[1].powerData.PowerSetID === newState.primaryPowerset.nID) {
						checkRemoveSupplementalPowers(info[1].powerData, newState);

						if ((info[1].powerData.Slottable) && (info[1].slots?.length > 1)) {
							newState.slotCount = newState.slotCount + 1 - info[1].slots.length;
						}

						delete newState.powers[info[0]];
					}
				})
			}

			if ((newState.archetype) && (action.powerset)) {
				newState.primaryPowerset = action.powerset;
			} else {
				delete newState.primaryPowerset;
			}

			return newState;
		case SELECT_SECONDARY_POWERSET:
			newState = { ...state };

			if (newState.secondaryPowerset) {
				Object.entries(newState.powers).forEach(info => {
					if (info[1].powerData.PowerSetID === newState.secondaryPowerset.nID) {
						checkRemoveSupplementalPowers(info[1].powerData, newState);

						if ((info[1].powerData.Slottable) && (info[1].slots?.length > 1)) {
							newState.slotCount = newState.slotCount + 1 - info[1].slots.length;
						}

						delete newState.powers[info[0]];
					}
				})
			}

			if ((newState.archetype) && (action.powerset)) {
				newState.secondaryPowerset = action.powerset;

				let curData = { label: 1.1, powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }

				if (curData.powerData.Effects?.find(effect => effect.ToWho === 2)) {
					curData.active = !curData.powerData.RechargeTime;
				}

				newState.powers[1.1] = curData;
			} else {
				delete newState.secondaryPowerset;
			}

			return newState;
		case SELECT_POWER:
			newState = { ...state };

			delete newState.modal;

			if (newState.powers[action.level]) {
				checkRemoveSupplementalPowers(newState.powers[action.level].powerData, newState);

				if ((newState.powers[action.level].powerData?.Slottable) && (newState.powers[action.level].slots?.length > 1)) {
					newState.slotCount = newState.slotCount + 1 - newState.powers[action.level].slots.length;
				}

				if (newState.powers[action.level].powerData.GroupName === "Pool") {
					let powerCount = Object.entries(newState.powers).filter(item => item[1].powerData.PowerSetID === newState.powers[action.level].powerData.PowerSetID).length;

					if (powerCount <= 1) {
						let poolIndex = newState.pools.findIndex(item => item.nID === newState.powers[action.level].powerData.PowerSetID);

						if (poolIndex > -1) {
							newState.pools.splice(poolIndex, 1);
						}
					}
				} else if (newState.powers[action.level].powerData.GroupName === "Epic") {
					let powerCount = Object.entries(newState.powers).filter(item => item[1].powerData.PowerSetID === newState.powers[action.level].powerData.PowerSetID).length;

					if (powerCount <= 1) {
						delete newState.epicPool;
					}
				}
			}

			if (action.power?.PowerIndex > 0) {
				// Clear out the power if we have it selected somewhere else.
				for (const [key, value] of Object.entries(newState.powers)) {
					if (value?.powerData?.PowerIndex === action.power.PowerIndex) {
						delete newState.powers[key];
					}
				}

				if (action.power.GroupName === "Pool") {
					var selectedPool = newState.pools.find(curPool => curPool.nID === action.power.PowerSetID);

					if (!selectedPool) {
						selectedPool = newState.powersetData.find(mySet => mySet.nID === action.power.PowerSetID);
						newState.pools.push(selectedPool);
						newState.pools.sort(displayNameSort);
					}
				} else if (action.power.GroupName === "Epic") {
					if (!newState.epicPool) {
						newState.epicPool = newState.powersetData.find(mySet => mySet.nID === action.power.PowerSetID);
					} else if (state.epicPool.nID !== action.power.PowerSetID) {
						console.log("ERROR!  Tried to add an epic power from another pool!"); // TODO - Make this an error modal!
						return newState;
					}
				}

				let curData = { label: action.level, powerData: action.power };

				if (action.power.Slottable) {
					curData.slots = [ undefined ];
				}

				if (action.power.Effects?.find(effect => effect.ToWho === 2)) {
					curData.active = !action.power.RechargeTime;
				}

				newState.powers[action.level] = curData;

				checkAddSupplementalPowers(action.power, newState);

				return newState
			}

			delete newState.powers[action.level]; // This is after all the other logic to ensure bad data is cleaned up.
			return newState;
		case ADD_SLOT_TO_POWER:
			newState = { ...state };

			if ((action.powerInfo.slots.length < 6) && (newState.slotCount < newState.slotMax)) {
				action.powerInfo.slots.push(undefined);
				newState.slotCount++;
			}

			return newState;
		case APPLY_ENHANCEMENT_TO_POWER:
			newState = { ...state };

			if ((action.enhancement) && (action.slotIndex < action.powerInfo?.slots?.length)) {
				switch (action.enhancement.TypeID) {
					case -1:
						switch (action.enhancement.SpecialText) {
							case "Clear":
								action.powerInfo.slots[action.slotIndex] = undefined;
								break;
							case "Remove":
								action.powerInfo.slots.splice(action.slotIndex, 1);
								newState.slotCount--;
								break;
							default:
								break;
						}
						break;
					default:
						let placed = setIOAlreadyPlaced(action.enhancement, newState.powers, action.powerInfo, action.slotIndex);

						if (placed) {
							newState.powers[placed[0]].slots[placed[1]] = undefined;
						}

						action.powerInfo.slots[action.slotIndex] = action.enhancement;
						break;
				}
			}

			return newState;
		case SELECT_ACCOLADE:
			newState = { ...state };

			if (action.accolade) {
				state.powers["Accolade" + action.index] = { powerData: action.accolade, active: !action.accolade.RechargeTime };
			} else {
				delete state.powers["Accolade" + action.index];
			}

			return newState;
		case SELECT_INCARNATE:
			newState = { ...state };

			if (action.incarnate) {
				state.powers["Incarnate" + action.set] = { powerData: action.incarnate, active: !action.incarnate.RechargeTime };
			} else {
				delete state.powers["Incarnate" + action.set];
			}

			return newState;
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}