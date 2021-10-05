import { useStoreContext } from "../../utils/GlobalState";
import { useState, useEffect } from "react";
import { SET_CHARACTER_NAME, SELECT_ORIGIN, SELECT_PRIMARY_POWERSET, SELECT_SECONDARY_POWERSET } from "../../utils/actions";

import IconDropdown from "../IconDropdown/IconDropdown";
import PowerPoolReadout from "..//PowerPoolReadout/PowerPoolReadout";

import "./CharacterInfoPanel.css";

function CharacterInfoPanel() {
	const [state,dispatch] = useStoreContext();
	const [myName, setMyName] = useState(state.characterName || "");

	const primaryPowersetList = state.powersetData.filter(item => item.GroupName === state.archetype.PrimaryGroup);
	const secondaryPowersetList = state.powersetData.filter(item => item.GroupName === state.archetype.SecondaryGroup);

	useEffect(() => {
		if (state?.archetype) {
			var ATinfo = state.archetype.DisplayName;

			if ((state.primaryPowerset) && (state.secondaryPowerset)) {
				ATinfo = (state.primaryPowerset.ShortName || state.primaryPowerset.DisplayName) + "/" + (state.secondaryPowerset.ShortName || state.secondaryPowerset.DisplayName) + " " + ATinfo;
			}

			if (state.characterName) {
				document.title = "CoH Builder: " + state.characterName + " (" + ATinfo + ")";
			} else {
				document.title = "CoH Builder: " + ATinfo;
			}
		} else {
			document.title = "CoH Builder";
		}
	 }, [ state.archetype, state.characterName, state.primaryPowerset, state.secondaryPowerset ]);

	const setCharacterName = (event) => {
		setMyName(event.target.value);
		dispatch({ type: SET_CHARACTER_NAME, name: event.target.value });
	};

	const getOriginIcon = (origin) => {
		const originIcon = require("../../assets/images/origins/" + origin + ".png");
		return originIcon;
	};

	const changeOrigin = (origin) => {
		dispatch({ type: SELECT_ORIGIN, origin });
	};

	const getPrimaryPowersetIcon = (setName) => {
		const powerset = primaryPowersetList.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changePrimaryPowerset = (setName) => {
		dispatch({ type: SELECT_PRIMARY_POWERSET, powerset: primaryPowersetList.find(item => item.DisplayName === setName) });
	};

	const getSecondaryPowersetIcon = (setName) => {
		const powerset = secondaryPowersetList.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changeSecondaryPowerset = (setName) => {
		dispatch({ type: SELECT_SECONDARY_POWERSET, powerset: secondaryPowersetList.find(item => item.DisplayName === setName) });
	};

	return (
		<div id="characterInfoPanel" className="builderPanel">
			<div>
				<input type="text" placeholder="[Enter Name]" maxLength="20" value={myName} onChange={setCharacterName}></input>
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
					itemList={primaryPowersetList}
					iconFunc={getPrimaryPowersetIcon}
					selectedItem={state.primaryPowerset.DisplayName}
					changeFunc={changePrimaryPowerset}
				/>
				<IconDropdown
					itemList={secondaryPowersetList}
					iconFunc={getSecondaryPowersetIcon}
					selectedItem={state.secondaryPowerset.DisplayName}
					changeFunc={changeSecondaryPowerset}
				/>
			</div>
			<PowerPoolReadout />
		</div>
	);
}

export default CharacterInfoPanel;