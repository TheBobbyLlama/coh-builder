import { useReducer } from "react";

import {
	SET_COLOR_THEME,
	SET_DATA_ENVIRONMENT,
	SET_CURRENT_PAGE,
	SELECT_ARCHETYPE,
	SELECT_ORIGIN,
	SELECT_PRIMARY_POWERSET,
	SELECT_SECONDARY_POWERSET,
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER
} from "./actions";

import { initializeDataset } from "../lib/db";

export const reducer = (state, action) => {
	let newState;

	switch (action.type) {
		case SET_COLOR_THEME:
			if (action.theme) {
				localStorage.setItem("theme", action.theme);
			}
			return { ...state, theme: action.theme };
		case SET_DATA_ENVIRONMENT:
			newState = { ...state, environment: action.environment, page: PAGE_MAIN_MENU };

			if (action.environment) {
				delete newState.archetype;
				delete newState.primaryPowerset;
				delete newState.secondaryPowerset;
				// TODO - Any other state-related cleanup!
				state.dataset = initializeDataset(action.environment);
			}
			return newState;
		case SET_CURRENT_PAGE:
			return { ...state, page: action.page };
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
					newState.primaryPowerset = newState.primaryPowersetList[0];
				} else {
					delete newState.primaryPowerset;
				}

				if (newState.secondaryPowersetList.length) {
					newState.secondaryPowerset = newState.secondaryPowersetList[0];
				} else {
					delete newState.secondaryPowerset;
				}

				newState.theme = newState.archetype.Hero ? "Hero" : "Villain";
				newState.page = PAGE_CHARACTER_DESIGNER;
			} else {
				delete newState.archetype;
				delete newState.primaryPowerset;
				delete newState.secondaryPowerset;
				newState.page = PAGE_MAIN_MENU;
			}
			return newState;
		case SELECT_ORIGIN:
			return { ...state, origin: action.origin };
		case SELECT_PRIMARY_POWERSET:
			newState = { ...state };

			if (action.powerset) {
				newState.primaryPowerset = action.powerset;
			} else {
				delete newState.primaryPowerset;
			}
			return newState;
		case SELECT_SECONDARY_POWERSET:
			newState = { ...state };

			if (action.powerset) {
				newState.secondaryPowerset = action.powerset;
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