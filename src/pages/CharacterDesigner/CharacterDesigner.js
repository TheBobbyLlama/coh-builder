import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_ORIGIN, SELECT_PRIMARY_POWERSET, SELECT_SECONDARY_POWERSET } from "../../utils/actions";

import IconDropdown from "../../components/IconDropdown/IconDropdown";

import "./CharacterDesigner.css";

function CharacterDesigner() {
	const [state, dispatch] = useStoreContext();

	console.log(state.primaryPowersetList);

	const getOriginIcon = (origin) => {
		const originIcon = require("../../assets/images/origins/" + origin + ".png");
		return originIcon;
	}

	const changeOrigin = (origin) => {
		dispatch({ type: SELECT_ORIGIN, origin });
	}

	const getPrimaryPowersetIcon = (setName) => {
		const powerset = state.primaryPowersetList.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changePrimaryPowerset = (setName) => {
		dispatch({ type: SELECT_PRIMARY_POWERSET, powerset: state.primaryPowersetList.find(item => item.DisplayName === setName) });
	}

	const getSecondaryPowersetIcon = (setName) => {
		const powerset = state.secondaryPowersetList.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changeSecondaryPowerset = (setName) => {
		dispatch({ type: SELECT_SECONDARY_POWERSET, powerset: state.secondaryPowersetList.find(item => item.DisplayName === setName) });
	}

	return (
		<div id="characterDesigner">
			<div id="generalInfo" className="builderPanel">
				<div>
					<input type="text" placeholder="[Enter Name]" maxLength="20"></input>
				</div>
				<div id="ATinfo">
					<IconDropdown
						itemList={state.archetype.Origin}
						iconFunc={getOriginIcon}
						selectedItem={state.origin}
						changeFunc={changeOrigin}
					/>
					<h3 id="ATname">{state.archetype.DisplayName}</h3>
				</div>
				<div id="powersetSelection">
					<IconDropdown
						itemList={state.primaryPowersetList.map(item => item.DisplayName)}
						iconFunc={getPrimaryPowersetIcon}
						selectedItem={state.primaryPowerset.DisplayName}
						changeFunc={changePrimaryPowerset}
					/>
					<IconDropdown
						itemList={state.secondaryPowersetList.map(item => item.DisplayName)}
						iconFunc={getSecondaryPowersetIcon}
						selectedItem={state.secondaryPowerset.DisplayName}
						changeFunc={changeSecondaryPowerset}
					/>
				</div>
			</div>
			<div id="generalControls" className="builderPanel">
				<button type="button" className="pretty">View Totals</button>
				<button type="button" className="pretty">Active Sets</button>
			</div>
			<div id="powerData" className="builderPanel">
				Power Data goes here.
			</div>
		</div>
	);
}

export default CharacterDesigner;