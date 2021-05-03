import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { PAGE_MAIN_MENU, PAGE_SELECT_ARCHETYPE, PAGE_CHARACTER_DESIGNER } from "../../utils/actions";
import { initializeDataset } from "../../lib/db";

import MainMenu from "../MainMenu/MainMenu";
import ArchetypeSelector from "../ArchetypeSelector/ArchetypeSelector";

import "./CharacterCreator.css";

function CharacterCreator() {
	const [state,] = useStoreContext();
	const [,] = useState(initializeDataset(state.environment)); // HACK - Force the dataset to initialize.

	return (
		<div id="creator" className={state.theme}>
			{((!state.page) || (state.page === PAGE_MAIN_MENU)) ? <MainMenu /> : <></>}
			{(state.page === PAGE_SELECT_ARCHETYPE) ? <ArchetypeSelector /> : <></>}
			{(state.page === PAGE_CHARACTER_DESIGNER) ? <></> : <></>}
		</div>
	);
}

export default CharacterCreator;