import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_ARCHETYPE } from "../../utils/actions"

import { getArchetypeData } from "../../lib/db";

import "./ArchetypeSelector.css";

function ArchetypeSelector() {
	const [state, dispatch] = useStoreContext();

	const archetypes = getArchetypeData(state.environment);

	const setArchetype = (myAT) => {
		dispatch({ type: SELECT_ARCHETYPE, archetype: myAT });
	}

	return (
		<div id="archetypeSelector">
			<div className="selectionBox builderPanel">
				<div className="titleHolder">
					<h2>Archetype Selection</h2>
				</div>
				<div className="selectionList">
					{archetypes.map(curAt => {
						const ATicon = require("../../assets/images/archetypes/" + curAt.ClassName + ".png");
						return <button type="button" className="prettyBig" title={curAt.DescShort} key={curAt.ClassName} disabled={!(curAt.ClassType % 2)} onClick={() => { setArchetype(curAt); }}><img src={ATicon.default} alt="" /> {curAt.DisplayName}</button>
					})}
				</div>
				<div className="buttonControls">
					<button type="button" className="prettyBig cancel" onClick={() => { setArchetype(null); }}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

export default ArchetypeSelector;