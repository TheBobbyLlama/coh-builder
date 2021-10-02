import { useStoreContext } from "../../utils/GlobalState";
import { PAGE_MAIN_MENU, PAGE_SELECT_ARCHETYPE, PAGE_CHARACTER_DESIGNER, PAGE_IMPORT } from "../../utils/actions";

import MainMenu from "../MainMenu/MainMenu";
import ArchetypeSelector from "../ArchetypeSelector/ArchetypeSelector";
import CharacterDesigner from "../CharacterDesigner/CharacterDesigner";
import ImportCharacter from "../ImportCharacter/ImportCharacter";

import ModalManager from "../../components/ModalManager/ModalManager";

import "./CharacterCreator.css";

function CharacterCreator() {
	const [state,] = useStoreContext();

	return (
		<>
			<div id="creator" className={state.theme}>
				{((!state.page) || (state.page === PAGE_MAIN_MENU)) ? <MainMenu /> : <></>}
				{(state.page === PAGE_SELECT_ARCHETYPE) ? <ArchetypeSelector /> : <></>}
				{(state.page === PAGE_CHARACTER_DESIGNER) ? <CharacterDesigner /> : <></>}
				{(state.page === PAGE_IMPORT) ? <ImportCharacter /> : <></>}
			</div>
			<ModalManager />
		</>
	);
}

export default CharacterCreator;