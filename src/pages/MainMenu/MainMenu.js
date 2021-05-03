import { useStoreContext } from "../../utils/GlobalState";
import { SET_CURRENT_PAGE, PAGE_SELECT_ARCHETYPE } from "../../utils/actions"

import "./MainMenu.css";

function MainMenu() {
	const [, dispatch] = useStoreContext();

	const startNewCharacter = () => {
		dispatch({ type: SET_CURRENT_PAGE, page: PAGE_SELECT_ARCHETYPE });
	}

	return (
		<div id="mainMenu">
			<div>
				<h1>CoH Builder</h1>
				<div className="builderPanel">
					<p>An online character builder for City of Heroes!</p>
					<p>Designed for <a href="https://forums.homecomingservers.com/" target="_blank" rel="noreferrer">Homecoming</a>.</p>
				</div>
			</div>
			<div className="buttonHolder">
				<button type="button" className="prettyBig" onClick={startNewCharacter}>Start a New Character</button>
				<button type="button" className="prettyBig" disabled>Load a Character</button>
			</div>
		</div>
	);
}

export default MainMenu;