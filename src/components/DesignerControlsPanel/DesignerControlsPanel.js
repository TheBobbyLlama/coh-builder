import { useStoreContext } from "../../utils/GlobalState";
import { SET_COLOR_THEME } from "../../utils/actions";

import "./DesignerControlsPanel.css";

function DesignerControlsPanel() {
	const [state,dispatch] = useStoreContext();

	const setColorTheme = (theme) => {
		dispatch({ type: SET_COLOR_THEME, theme });
	}

	return (
		<div id="designerControls" className="builderPanel">
			<div id="themeChanger"><div className={(state.theme !== "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Hero"); }}></div><div className={(state.theme === "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Villain"); }}></div></div>
			<div><button type="button" className="pretty">View Totals</button></div>
			<div><button type="button" className="pretty">Active Sets</button></div>
			<div id="counterHolder"><div id="slotCounter">{(state.slotMax - state.slotCount)}</div></div>
			<div><button type="button" className="pretty">Accolades</button></div>
			<div><button type="button" className="pretty">Incarnate</button></div>
		</div>
	);
}

export default DesignerControlsPanel;