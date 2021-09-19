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
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER
} from "./actions";

import { initializeDataset } from "../lib/db";

const getPowersetData = (state, powerType, powersetInfo) => {
	if ((state.environment) && (state.archetype) && (powersetInfo)) {
		var powerName = powersetInfo.FileName || powersetInfo.DisplayName.replace(" ", "_");
		var fileName = state.archetype.ClassName + "_" + powerType + ".";

		console.log("../data/" + state.environment + "/db/Player/" + fileName + powerName + ".json");
		let powerset = require("../data/" + state.environment + "/db/Player/" + fileName + powerName + ".json");
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
				delete newState.archetype;
				delete newState.primaryPowerset;
				delete newState.secondaryPowerset;
				// TODO - Any other state-related cleanup!
				state.dataset = initializeDataset(action.environment);
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

			if (action.archetype) {
				newState.archetype = action.archetype;

				if (action.archetype.Origin?.length) {
					newState.origin = action.archetype.Origin[0];
				} else {
					delete newState.origin;
				}

				newState.primaryPowersetList = newState.dataset.filter(curSet => curSet.nIDs.find(item => newState.archetype.Primary.indexOf(item) > -1)).sort(function (a, b) { if (a.DisplayName < b.DisplayName) { return -1; } else if (a.DisplayName > b.DisplayName) { return 1; } else {return 0; }});
				newState.secondaryPowersetList = newState.dataset.filter(curSet => curSet.nIDs.find(item => newState.archetype.Secondary.indexOf(item) > -1)).sort(function (a, b) { if (a.DisplayName < b.DisplayName) { return -1; } else if (a.DisplayName > b.DisplayName) { return 1; } else {return 0; }});

				if (newState.primaryPowersetList.length) {
					newState.primaryPowerset = getPowersetData(newState, newState.archetype.PrimaryGroup, newState.primaryPowersetList[0]);
				} else {
					delete newState.primaryPowerset;
				}

				if (newState.secondaryPowersetList.length) {
					newState.secondaryPowerset = getPowersetData(newState, newState.archetype.SecondaryGroup, newState.secondaryPowersetList[0]);
					newState.powers[1.1] = { powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] };
				} else {
					delete newState.secondaryPowerset;
				}

				newState.theme = newState.archetype.Hero ? "Hero" : "Villain";
				newState.page = PAGE_CHARACTER_DESIGNER;
			} else {
				delete newState.modal;
				delete newState.archetype;
				delete newState.primaryPowerset;
				delete newState.secondaryPowerset;
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

			if ((newState.archetype) && (action.powerset)) {
				newState.primaryPowerset = getPowersetData(newState, newState.archetype.PrimaryGroup, action.powerset);
			} else {
				delete newState.primaryPowerset;
			}

			return newState;
		case SELECT_SECONDARY_POWERSET:
			newState = { ...state };

			if ((newState.archetype) && (action.powerset)) {
				newState.secondaryPowerset = getPowersetData(newState, newState.archetype.SecondaryGroup, action.powerset);
				newState.powers[1.1] = { powerData: newState.secondaryPowerset.Powers.find(item => item.Level === 1), slots: [ undefined ] }
			} else {
				delete newState.secondaryPowerset;
			}

			return newState;
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}