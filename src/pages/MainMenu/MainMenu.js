import React, { useEffect } from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { SET_CURRENT_PAGE, PAGE_SELECT_ARCHETYPE, PAGE_IMPORT } from "../../utils/actions"

import "./MainMenu.css";

function MainMenu() {
	const [, dispatch] = useStoreContext();

	// Bit of a kludge here, but make sure the document title is generic when we get here.
	useEffect(() => {
		document.title = "CoH Builder";
	 }, []);

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
		</div>
	);
}

export default MainMenu;