import { useReducer } from "react";

import {
	SET_COLOR_THEME,
	SET_DATA_ENVIRONMENT,
	SET_CURRENT_PAGE,
	LOAD_POWER_POOL,
	SHOW_MODAL,
	SELECT_ARCHETYPE,
	SET_CHARACTER_NAME,
	SELECT_ORIGIN,
	SELECT_PRIMARY_POWERSET,
	SELECT_SECONDARY_POWERSET,
	SELECT_POWER,
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER
} from "./actions";

import { initializeDataset } from "../lib/db";

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
};

const getPowersetData = (state, powerType, powersetInfo) => {
	if ((state.environment) && (state.archetype) && (powersetInfo)) {
		var setName = powersetInfo.FileName || powersetInfo.DisplayName.replace(" ", "_");
		var fileName = state.archetype.ClassName + "_" + powerType + ".";

		let powerset = require("../data/" + state.environment + "/db/Player/" + fileName + setName + ".json");
		return powerset;
	}
	else {
		return null;
	}
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
				[newState.powerData, newState.poolAtlas] = initializeDataset(action.environment);
				newState.poolData = [];
				localStorage.setItem("environment", action.environment);
			}
			return newState;
		case SET_CURRENT_PAGE:
			return { ...state, page: action.page, theme: "Hero" };
		case LOAD_POWER_POOL:
			newState = { ...state };

			if ((action.powerPool) && (!newState.poolData.find(curPool => curPool.nID === action.powerPool.nID))) {
				newState.poolData.push(action.powerPool);
				newState.poolData = newState.poolData.sort(displayNameSort);
			}

			return newState;
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

				newState.primaryPowersetList = newState.powerData.filter(curSet => curSet.nIDs.find(item => newState.archetype.Primary.indexOf(item) > -1)).sort(displayNameSort);
				newState.secondaryPowersetList = newState.powerData.filter(curSet => curSet.nIDs.find(item => newState.archetype.Secondary.indexOf(item) > -1)).sort(displayNameSort);
				newState.powers = {};

				if (newState.primaryPowersetList.length) {
					newState.primaryPowerset = getPowersetData(newState, newState.archetype.PrimaryGroup, newState.primaryPowersetList[0]);
				}

				if (newState.secondaryPowersetList.length) {
					newState.secondaryPowerset = getPowersetData(newState, newState.archetype.SecondaryGroup, newState.secondaryPowersetList[0]);
					newState.powers[1.1] = { powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] };
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
				state.characterName = action.name;
			} else {
				state.characterName = "";
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
				newState.primaryPowerset = getPowersetData(newState, newState.archetype.PrimaryGroup, action.powerset);
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
				newState.secondaryPowerset = getPowersetData(newState, newState.archetype.SecondaryGroup, action.powerset);
				newState.powers[1.1] = { powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }
			} else {
				delete newState.secondaryPowerset;
			}

			return newState;
		case SELECT_POWER:
			newState = { ...state };

			delete newState.modal;

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
						selectedPool = newState.poolData.find(mySet => mySet.nID === action.power.PowerSetID);
						newState.pools.push(selectedPool);
						newState.pools.sort(displayNameSort);
					}
				} else if (action.power.GroupName === "Epic") {
					if (!newState.epicPool) {
						newState.epicPool = newState.poolData.find(mySet => mySet.nID === action.power.PowerSetID);
					} else if (state.epicPool.nID !== action.power.PowerSetID) {
						console.log("ERROR!  Tried to add an epic power from another pool!"); // TODO - Make this an error modal!
						return newState;
					}
				}

				newState.powers[action.level] = { powerData: action.power, slots: [ undefined ] };
				return newState
			} else if (newState.powers[action.level]) {
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

			delete newState.powers[action.level]; // This is after all the other logic to ensure bad data is cleaned up.
			return newState;
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}