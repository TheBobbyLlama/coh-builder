import React, { useState, useEffect } from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { SHOW_MODAL, SET_COLOR_THEME, SET_CHARACTER_NAME, SELECT_ORIGIN, SELECT_PRIMARY_POWERSET, SELECT_SECONDARY_POWERSET, MODAL_LEAVE_DESIGNER } from "../../utils/actions";

import IconDropdown from "../../components/IconDropdown/IconDropdown";
import PowerPoolReadout from "../../components/PowerPoolReadout/PowerPoolReadout";
import PowerWidget from "../../components/PowerWidget/PowerWidget";

import "./CharacterDesigner.css";

function CharacterDesigner() {
	const [state, dispatch] = useStoreContext();
	const [myName, setMyName] = useState("");

	const powerLevels = [ 1, 1.1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 49 ];

	useEffect(() => {
		if (state?.archetype) {
			var ATinfo = state.archetype.DisplayName;

			if ((state.primaryPowerset) && (state.secondaryPowerset)) {
				var primary = state.powerData.find(set => set.DisplayName === state.primaryPowerset.DisplayName);
				var secondary = state.powerData.find(set => set.DisplayName === state.secondaryPowerset.DisplayName);
				ATinfo = (primary.ShortName || primary.DisplayName) + "/" + (secondary.ShortName || secondary.DisplayName) + " " + ATinfo;
			}

			if (state.characterName) {
				document.title = "CoH Builder: " + state.characterName + " (" + ATinfo + ")";
			} else {
				document.title = "CoH Builder: " + ATinfo;
			}
		} else {
			document.title = "CoH Builder";
		}
	 }, [ state ]);

	const showCloseModal = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_LEAVE_DESIGNER } });
	}

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
		const powerset = state.powerData.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changePrimaryPowerset = (setName) => {
		dispatch({ type: SELECT_PRIMARY_POWERSET, powerset: state.primaryPowersetList.find(item => item.DisplayName === setName) });
	};

	const getSecondaryPowersetIcon = (setName) => {
		const powerset = state.powerData.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changeSecondaryPowerset = (setName) => {
		dispatch({ type: SELECT_SECONDARY_POWERSET, powerset: state.secondaryPowersetList.find(item => item.DisplayName === setName) });
	};

	const setColorTheme = (theme) => {
		dispatch({ type: SET_COLOR_THEME, theme });
	}

	return (
		<div id="characterDesigner">
			<div id="generalInfo" className="builderPanel">
				<div>
					<input type="text" placeholder="[Enter Name]" maxLength="20" value={myName} onChange={setCharacterName}></input>
				</div>
				<div id="closeButtonHolder">
					<button type="button" className="pretty cancel" onClick={showCloseModal}>X</button>
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
				<PowerPoolReadout />
			</div>
			<div id="generalControls" className="builderPanel">
				<div id="themeChanger"><div className={(state.theme !== "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Hero"); }}></div><div className={(state.theme === "Hero") ? "inactive" : ""} onClick={() => { setColorTheme("Villain"); }}></div></div>
				<div><button type="button" className="pretty">View Totals</button></div>
				<div><button type="button" className="pretty">Active Sets</button></div>
				<div id="counterHolder"><div id="slotCounter">{(state.slotMax - state.slotCount)}</div></div>
				<div><button type="button" className="pretty">Accolades</button></div>
				<div><button type="button" className="pretty">Incarnate</button></div>
			</div>
			<div id="powerData" className="builderPanel">
				TODO
			</div>
			<div id="powerHolder"  className="builderPanel">
				<div id="powerArea">
					{powerLevels.map((item, index) => {
						return (<PowerWidget
									key={"Power" + index}
									label={Math.floor(item)}
									target={state.powers[item]}
									allowChange={item !== 1.1}
								/>);
					})}
				</div>
			</div>
		</div>
	);
}

export default CharacterDesigner;