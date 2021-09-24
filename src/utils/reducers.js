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
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER
} from "./actions";

import { initializeDataset } from "../lib/db";
import { setIOAlreadyPlaced } from "./util";

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

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_COLOR_THEME:
			return { ...state, theme: action.theme };
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

				newState.primaryPowerset = newState.powersetData.find(item => item.GroupName === newState.archetype.PrimaryGroup);
				newState.secondaryPowerset = newState.powersetData.find(item => item.GroupName === newState.archetype.SecondaryGroup);

				if (newState.secondaryPowerset) {
					newState.powers[1.1] = { label: 1.1, powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] };
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
				Object.entries(newState.powers).forEach(item => {
					if (item[1].powerData.PowerSetID === newState.primaryPowerset.nID) {
						delete newState.powers[item[0]];
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
				Object.entries(newState.powers).forEach(item => {
					if (item[1].powerData.PowerSetID === newState.secondaryPowerset.nID) {
						delete newState.powers[item[0]];
					}
				})
			}

			if ((newState.archetype) && (action.powerset)) {
				newState.secondaryPowerset = action.powerset;
				newState.powers[1.1] = { label: 1.1, powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }
			} else {
				delete newState.secondaryPowerset;
			}

			return newState;
		case SELECT_POWER:
			newState = { ...state };

			delete newState.modal;

			if (newState.powers[action.level]) {
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

				newState.powers[action.level] = { label: action.level, powerData: action.power, slots: [ undefined ] };
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
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}