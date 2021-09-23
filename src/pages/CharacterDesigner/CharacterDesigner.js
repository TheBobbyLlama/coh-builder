import { useStoreContext } from "../../utils/GlobalState";
import { SHOW_MODAL, MODAL_LEAVE_DESIGNER } from "../../utils/actions";

import CharacterInfoPanel from "../../components/CharacterInfoPanel/CharacterInfoPanel";
import DesignerControlsPanel from "../../components/DesignerControlsPanel/DesignerControlsPanel";
import CharacterDetailPanel from "../../components/CharacterDetailPanel/CharacterDetailPanel";
import CharacterPowerPanel from "../../components/CharacterPowerPanel/CharacterPowerPanel";

import "./CharacterDesigner.css";

function CharacterDesigner() {
	const [, dispatch] = useStoreContext();

	const showCloseModal = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_LEAVE_DESIGNER } });
	}

	return (
		<div id="characterDesigner">
			<div id="closeButtonHolder">
				<button type="button" className="pretty cancel" onClick={showCloseModal}>X</button>
			</div>
			<CharacterInfoPanel />
			<DesignerControlsPanel />
			<CharacterDetailPanel />
			<CharacterPowerPanel />
		</div>
	);
}

export default CharacterDesigner;