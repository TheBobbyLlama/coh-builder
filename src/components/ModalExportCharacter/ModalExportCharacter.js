import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";

import { exportCharacter } from "../../utils/buildImportExport";

import "./ModalExportCharacter.css";

function ModalExportCharacter() {
	const [state, dispatch] = useStoreContext();

	const [copiedText, setCopiedText] = useState(0);

	let myName = state.characterName || "Character";
	let characterData = exportCharacter(state);
	// The '@' character that prefixes the data chunk is character code 64, indicating base64.
	let builderUrl = window.location.href + ((window.location.href.endsWith("/")) ? "" : "/") + "load?data=@" + characterData.base64Data;

	const createMidsDatachunk = () => {
		const lineLength = 67;
		let tmpChunk = characterData.hexData;
		let result = "| Copy & Paste this data into Mids Reborn : Hero Designer to view the build |\n|-------------------------------------------------------------------|\n";
		result += "|MxDz;" + characterData.ucSize + ";" + characterData.cSize + ";" + characterData.aSize + ";HEX;|\n";

		while (tmpChunk.length > lineLength) {
			let tmpStr = tmpChunk.substr(0, lineLength);
			tmpChunk = tmpChunk.substring(lineLength);

			result += "|" + tmpStr + "|\n";
		}

		if (tmpChunk.length) {
			result += "|" + tmpChunk + "|\n";
		}

		result += "|-------------------------------------------------------------------|";

		return result;
	}

	const copyUrl = () => {
		navigator.clipboard.writeText(builderUrl);
		setCopiedText(1);
	}

	const copyChunk = () => {
		navigator.clipboard.writeText(createMidsDatachunk());
		setCopiedText(2);
	}

	const done = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_HIDE } });
	}

	return (
		<div id="modalExportCharacter" className="builderPanel">
			<h2>Exporting {myName}</h2>
			<div className="clickMe">
				<i><span className="hideMobile">Click</span><span className="mobileOnly">Tap</span>&nbsp;to copy:</i>
			</div>
			<textarea readOnly={true} className={(copiedText === 1) ? "copied" : ""} value={builderUrl} onClick={copyUrl} />
			<div className="clickMe">
				<i><span className="hideMobile">Click</span><span className="mobileOnly">Tap</span>&nbsp;to copy:</i>
			</div>
			<textarea readOnly={true} className={(copiedText === 2) ? "copied" : ""} value={createMidsDatachunk()} onClick={copyChunk} />
			<div>
				<button type="button" className="pretty" onClick={done}>Ok</button>
			</div>
		</div>
	);
}

export default ModalExportCharacter;