import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { PAGE_MAIN_MENU, PAGE_SELECT_ARCHETYPE, PAGE_CHARACTER_DESIGNER, MODAL_LEAVE_DESIGNER, MODAL_SELECT_POWER } from "../../utils/actions";
import { initializeDataset } from "../../lib/db";

import MainMenu from "../MainMenu/MainMenu";
import ArchetypeSelector from "../ArchetypeSelector/ArchetypeSelector";
import CharacterDesigner from "../CharacterDesigner/CharacterDesigner";

import PoolLoaderAsync from "../../components/PoolLoaderAsync/PoolLoaderAsync";
import ModalLeaveDesigner from "../../components/ModalLeaveDesigner/ModalLeaveDesigner";
import ModalSelectPower from "../../components/ModalSelectPower/ModalSelectPower";

import "./CharacterCreator.css";

function CharacterCreator() {
	const [state,] = useStoreContext();
	const [,] = useState(initializeDataset(state.environment)); // HACK - Force the dataset to initialize.

	return (
		<>
			<div id="creator" className={state.theme}>
				{((!state.page) || (state.page === PAGE_MAIN_MENU)) ? <MainMenu /> : <></>}
				{(state.page === PAGE_SELECT_ARCHETYPE) ? <ArchetypeSelector /> : <></>}
				{(state.page === PAGE_CHARACTER_DESIGNER) ? <CharacterDesigner /> : <></>}
			</div>
			<PoolLoaderAsync />
			{(state.modal?.key) ? <div className={"modalBG " + state.theme}>
				{(state.modal.key === MODAL_LEAVE_DESIGNER) ? <ModalLeaveDesigner /> : <></>}
				{(state.modal.key === MODAL_SELECT_POWER) ? <ModalSelectPower /> : <></>}
			</div> : <></>}
		</>
	);
}

export default CharacterCreator;