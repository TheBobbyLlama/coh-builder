import React, { useEffect } from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { SET_CURRENT_PAGE, IMPORT_CHARACTER, PAGE_SELECT_ARCHETYPE, PAGE_IMPORT } from "../../utils/actions";
import midsIcon from "../../assets/images/ui/MidsReborn.png";
import paypalIcon from "../../assets/images/ui/PayPal.png";

import { getDataChunk } from '../../utils/buildImportExport';

import "./MainMenu.css";

function MainMenu() {
	const [, dispatch] = useStoreContext();

	// Bit of a kludge here, but make sure the document title is generic when we get here.
	useEffect(() => {
		document.title = "CoH Builder";

		if (getDataChunk(window.location.href)) {
			dispatch({type: IMPORT_CHARACTER, data: window.location.href });
		}
	 }, [dispatch]);

	const startNewCharacter = () => {
		dispatch({ type: SET_CURRENT_PAGE, page: PAGE_SELECT_ARCHETYPE });
	}

	const importCharacter = () => {
		dispatch({ type: SET_CURRENT_PAGE, page: PAGE_IMPORT });
	}

	return (
		<div id="mainMenu">
			<div>
				<div className="builderIcon">
					<h1>CoH Builder</h1>
				</div>
				<div className="builderPanel">
					<p>An online character builder for City of Heroes!</p>
					<p>Designed for <a href="https://forums.homecomingservers.com/" target="_blank" rel="noreferrer">Homecoming</a>.</p>
				</div>
			</div>
			<div className="buttonHolder">
				<button type="button" className="prettyBig" onClick={startNewCharacter}>Start a New Character</button>
				<button type="button" className="prettyBig" onClick={importCharacter}>Load a Character</button>
			</div>
			<div className="menuFooter">
				<a className="builderInset" href="https://midsreborn.com/" target="_blank" rel="noreferrer">
					<div>
						<img src={midsIcon} alt="Mids Reborn Logo" />
					</div>
					<div>
						<div><i>Powered by</i></div>
						<div><b>Mids Reborn</b></div>
					</div>
				</a>
				<a className="builderInset" href="https://www.paypal.com/paypalme/thebobbyllama?locale.x=en_US" target="_blank" rel="noreferrer">
					<div>
						<img src={paypalIcon} alt="Paypal Logo" />
					</div>
					<div>
						<div>Tip Jar</div>
					</div>
				</a>
			</div>
		</div>
	);
}

export default MainMenu;