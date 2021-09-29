import { useStoreContext } from "../../utils/GlobalState";
import { SET_COLOR_THEME, SHOW_MODAL, MODAL_SELECT_ACCOLADE, MODAL_SELECT_INCARNATE } from "../../utils/actions";

import "./DesignerControlsPanel.css";

function DesignerControlsPanel() {
	const [state,dispatch] = useStoreContext();

	const setColorTheme = (theme) => {
		dispatch({ type: SET_COLOR_THEME, theme });
	}

	const showAccoladeSelection = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_SELECT_ACCOLADE } });
	}

	const showIncarnateSelection = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_SELECT_INCARNATE } });
	}

	return (
		<div id="designerControls" className="builderPanel">
			<div id="themeChanger"><div className={(state.theme !== "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Hero"); }}></div><div className={(state.theme === "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Villain"); }}></div></div>
			<div><button type="button" className="pretty">View Totals</button></div>
			<div><button type="button" className="pretty">Active Sets</button></div>
			<div id="counterHolder"><div id="slotCounter">{(state.slotMax - state.slotCount)}</div></div>
			<div><button type="button" className="pretty" onClick={showAccoladeSelection}>Accolades</button></div>
			<div><button type="button" className="pretty" onClick={showIncarnateSelection}>Incarnate</button></div>
		</div>
	);
}

export default DesignerControlsPanel;