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
	IMPORT_CHARACTER,
	PAGE_MAIN_MENU,
	PAGE_CHARACTER_DESIGNER,
	MODAL_ERROR
} from "./actions";

import { initializeDataset } from "../lib/db";
import { findPower } from "./util";
import { clearCharacterData, setArchetype, selectPrimaryPowerset, selectSecondaryPowerset, selectPower, applyEnhancementToPower, selectAccolade, selectIncarnate } from "./characterUtils";
import { getDataChunk, importCharacter } from "./buildImportExport";

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

			setArchetype(newState, action.archetype);

			if (action.archetype) {
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
			selectPrimaryPowerset(state, action.powerset);
			return newState;
		case SELECT_SECONDARY_POWERSET:
			newState = { ...state };
			selectSecondaryPowerset(state, action.powerset);
			return newState;
		case SELECT_POWER:
			newState = { ...state };

			delete newState.modal;

			let error = selectPower(state, action.power, action.level);

			if (error) {
				newState = { ...state };
					newState.modal = {key: MODAL_ERROR, message: (error.message || error)};
					return newState;
			}
			
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
			applyEnhancementToPower(newState, action.powerInfo, action.enhancement, action.slotIndex);
			return newState;
		case SELECT_ACCOLADE:
			newState = { ...state };
			selectAccolade(newState, action.accolade, action.index);
			return newState;
		case SELECT_INCARNATE:
			newState = { ...state };
			selectIncarnate(state, action.incarnate, action.set);
			return newState;
		case IMPORT_CHARACTER:
			let tryChunk = getDataChunk(action.data);

			if (tryChunk) {
				newState = { ...state };

				let error = importCharacter(tryChunk, newState);

				if (error) {
					newState = { ...state };
					newState.modal = {key: MODAL_ERROR, message: "The character could not be loaded:\n" + (error.message || error)};
					return newState;
				} else {
					newState.page = PAGE_CHARACTER_DESIGNER;

					window.history.replaceState("", "CoH Builder - " + newState.characterName, "/");

					return newState;
				}
			}

			return state;
		default:
			return state;
	}
}

export function useBuilderReducer(initialState) {
	return useReducer(reducer, initialState);
}