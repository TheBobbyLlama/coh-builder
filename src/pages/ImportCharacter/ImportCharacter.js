import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SET_CURRENT_PAGE, IMPORT_CHARACTER, PAGE_MAIN_MENU } from "../../utils/actions"

import "./ImportCharacter.css";

function ImportCharacter() {
	const [, dispatch] = useStoreContext();

	const [importData, setImportData] = useState("");

	const importCharacter = () => {
		dispatch({ type: IMPORT_CHARACTER, data: importData });
	}

	const cancel = () => {
		dispatch({ type: SET_CURRENT_PAGE, page: PAGE_MAIN_MENU });
	}

	return (
		<div id="importCharacter">
			<div className="importBox builderPanel">
				<div className="titleHolder">
					<h2>Import Character</h2>
				</div>
				<div className="importArea">
					<textarea placeholder="You may paste a CoH Builder link here, or a Mids Reborn link or data chunk." value={importData} onChange={event => { setImportData(event.target.value); }} />
				</div>
				<div className="buttonControls">
					<button type="button" className="prettyBig confirm" onClick={importCharacter} disabled={!importData}>Import!</button>
					<button type="button" className="prettyBig cancel" onClick={cancel}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

export default ImportCharacter;