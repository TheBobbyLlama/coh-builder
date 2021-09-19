import React, { useEffect } from 'react';
import { useStoreContext } from "../../utils/GlobalState";
import { SHOW_MODAL, SET_CHARACTER_NAME, SELECT_ORIGIN, SELECT_PRIMARY_POWERSET, SELECT_SECONDARY_POWERSET, MODAL_LEAVE_DESIGNER } from "../../utils/actions";

import IconDropdown from "../../components/IconDropdown/IconDropdown";
import PowerWidget from "../../components/PowerWidget/PowerWidget";

import "./CharacterDesigner.css";

function CharacterDesigner() {
	const [state, dispatch] = useStoreContext();

	const powerLevels = [ 1, 1.1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 49 ];

	useEffect(() => {
		if (state?.archetype) {
			var ATinfo = state.archetype.DisplayName;

			if ((state.primaryPowerset) && (state.secondaryPowerset)) {
				var primary = state.dataset.find(set => set.DisplayName === state.primaryPowerset.DisplayName);
				var secondary = state.dataset.find(set => set.DisplayName === state.secondaryPowerset.DisplayName);
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

	console.log(state.primaryPowersetList);

	const showCloseModal = () => {
		dispatch({ type: SHOW_MODAL, modal: MODAL_LEAVE_DESIGNER });
	}

	const setCharacterName = (event) => {
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
		const powerset = state.dataset.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changePrimaryPowerset = (setName) => {
		dispatch({ type: SELECT_PRIMARY_POWERSET, powerset: state.primaryPowersetList.find(item => item.DisplayName === setName) });
	};

	const getSecondaryPowersetIcon = (setName) => {
		const powerset = state.dataset.find(item => item.DisplayName === setName);
		const setIcon = require("../../assets/images/powersets/" + powerset.ImageName);
		return setIcon;
	};

	const changeSecondaryPowerset = (setName) => {
		dispatch({ type: SELECT_SECONDARY_POWERSET, powerset: state.secondaryPowersetList.find(item => item.DisplayName === setName) });
	};

	return (
		<div id="characterDesigner">
			<div id="closeButtonHolder">
			<button type="button" className="pretty cancel" onClick={showCloseModal}>X</button>
			</div>
			<div id="generalInfo" className="builderPanel">
				<div>
					<input type="text" placeholder="[Enter Name]" maxLength="20" value={state.characterName} onChange={setCharacterName}></input>
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
				<div id="powerPools" className="builderInset">
					<div className="titleHolder">
						<h4>Pools</h4>
					</div>
					<div id="poolList">

					</div>
				</div>
			</div>
			<div id="generalControls" className="builderPanel">
				<button type="button" className="pretty">View Totals</button>
				<button type="button" className="pretty">Active Sets</button>
				<button type="button" className="pretty">Accolades</button>
				<button type="button" className="pretty">Incarnate</button>
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
								/>);
					})}
				</div>
			</div>
		</div>
	);
}

export default CharacterDesigner;