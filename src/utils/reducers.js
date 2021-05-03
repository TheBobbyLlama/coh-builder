import { useReducer } from "react";

import {
	SET_COLOR_THEME,
	SET_DATA_ENVIRONMENT,
	SET_CURRENT_PAGE,
	SELECT_ARCHETYPE,
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
				delete newState.selectedArchetype;
				// TODO - Any other state-related cleanup!
				initializeDataset(action.environment);
			}
			return newState;
		case SET_CURRENT_PAGE:
			return { ...state, page: action.page };
		case SELECT_ARCHETYPE:
			newState = { ...state };

			if (action.archetype) {
				newState.selectedArchetype = action.archetype;
				newState.page = PAGE_CHARACTER_DESIGNER;
			} else {
				delete newState.selectedArchetype;
				newState.page = PAGE_MAIN_MENU;
			}
			return newState;
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}