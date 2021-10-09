import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_POWER, SHOW_MODAL, MODAL_HIDE } from "../../utils/actions";
import { validPoolPower } from "../../utils/util";

import "./ModalSelectPower.css";

function ModalSelectPower() {
	const [state, dispatch] = useStoreContext();

	const findSelectedPowerset = () => {
		const curPower = state.powers[state.modal.level]?.powerData;

		if (curPower) {
			return state.powersetData.find(curSet => curSet.nID === curPower.PowerSetID);
		} else {
			return state.primaryPowerset;
		}
	};

	const findSelectedPowerList = (set) => {
		if ((set.GroupName === "Pool") || (set.GroupName === "Epic")) {
			return set.Powers.filter(item => ((item?.Level <= state.modal.level) && (validPoolPower(item, state.modal.level, state.powers))))
		} else if (set.nID === state.primaryPowerset.nID) {
			return set.Powers.filter(item => ((item.Level) && (item.Level <= state.modal.level)));
		} else if (set.nID === state.secondaryPowerset.nID) {
			return set.Powers.filter(item => ((item.Level) && (item.Level <= state.modal.level) && (item.Level > 1)));
		} else if (state.archetype.ClassType === 4) { // Special VEAT handling - Allow picks from base powersets!
			if (set.SetType === 1) {
				return set.Powers.filter(item => ((item.Level) && (item.Level <= state.modal.level)));
			} else if (set.SetType === 2) {
				return set.Powers.filter(item => ((item.Level) && (item.Level <= state.modal.level) && (item.Level > 1)));
			}
		}

		return [];
	}

	const [selectedPowerset, setSelectedPowerset] = useState(findSelectedPowerset());
	const [powerList, setPowerList] = useState(findSelectedPowerList(selectedPowerset));
	const [displayedPower, setDisplayedPower] = useState(state.powers[state.modal.level]?.powerData);
	const [showSelectedPowers, setShowSelectedPowers] = useState(false);

	const cancel = () => {
		dispatch({ type: SHOW_MODAL, modal: MODAL_HIDE });
	};

	const selectPrimaryPowerset = () => {
		setSelectedPowerset(state.primaryPowerset);
		setPowerList(findSelectedPowerList(state.primaryPowerset));
		setShowSelectedPowers(true);
	};

	const selectSecondaryPowerset = () => {
		setSelectedPowerset(state.secondaryPowerset);
		setPowerList(findSelectedPowerList(state.secondaryPowerset));
		setShowSelectedPowers(true);
	};

	const selectPowerset = (set) => {
		setSelectedPowerset(set);
		setPowerList(findSelectedPowerList(set));
		setShowSelectedPowers(true);
	}
	
	const setClearList = () => {
		let dummyPowerList = [ { DisplayName: "Remove Power", PowerIndex: -1, Level: 1000 } ]
		setSelectedPowerset({ nID: -1, Powers: dummyPowerList });
		setPowerList(dummyPowerList);
		setShowSelectedPowers(true);
	};

	const getIcon = (item) => {
		var icon = require("../../assets/images/powersets/" + item.ImageName)?.default;
		return icon;
	}

	const highlightPower = (power) => {
		if (([power]) && (window.screen.width >= 680)) {
			setDisplayedPower(power);
		}
	}

	const clickPower = (power) => {
		if ((power) && (power.PowerIndex === displayedPower?.PowerIndex)) {
			dispatch({ type: SELECT_POWER, level: state.modal.level, power });
		} else {
			setDisplayedPower(power);
		}
	};

	const backToPowersets = () => {
		//setSelectedPowerset(findSelectedPowerset());
		setShowSelectedPowers(false);
	}

	const baseSetPrimary = state.powersetData.find(set => ((set.SetType === 1) && (state.miscData.ATExclusionList[state.archetype.DisplayName]?.find(tmpSet => tmpSet === set.FullName))));
	const baseSetSecondary = state.powersetData.find(set => ((set.SetType === 2) && (state.miscData.ATExclusionList[state.archetype.DisplayName]?.find(tmpSet => tmpSet === set.FullName))));

	const powerPools = ((state.pools.length >= 4) ? state.pools : state.powersetData.filter(set => set.GroupName === "Pool")).filter(set => set.Powers.find(power => ((power.Level) && (power.Level <= state.modal.level))));
	const epicPools = ((state.epicPool) ? [ state.epicPool ] : state.powersetData.filter(set => state.archetype.Ancillary.indexOf(set.nID) > -1)).filter(set => set.Powers.find(power => power.Level <= state.modal.level));

	return (
		<div id="modalSelectPower" className="builderPanel">
			<div id="modalCloseHolder">
				<button type="button" className="pretty cancel" onClick={cancel}>X</button>
			</div>
			<h3>Select Power</h3>
			<div id="powerSelectionPanel">
				<div id="powersetList" className={"builderInset" + ((showSelectedPowers) ? " hideMobile" : "")}>
					{(baseSetPrimary) ? <div onClick={() => {selectPowerset(baseSetPrimary); }} className={(baseSetPrimary.nID === selectPowerset?.nID) ? "selected" : ""} title={baseSetPrimary.Description}><img src={getIcon(baseSetPrimary)} alt="" /> <b>{baseSetPrimary.DisplayName}</b></div> : <></>}
					<div onClick={selectPrimaryPowerset} className={(state.primaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""} title={state.primaryPowerset.Description}><img src={getIcon(state.primaryPowerset)} alt="" /> <b>{state.primaryPowerset.DisplayName}</b></div>
					{((state.modal.level >= 2) && (baseSetSecondary)) ? <div onClick={() => {selectPowerset(baseSetSecondary); }} className={(baseSetSecondary.nID === selectPowerset?.nID) ? "selected" : ""} title={baseSetSecondary.Description}><img src={getIcon(baseSetSecondary)} alt="" /> <b>{baseSetSecondary.DisplayName}</b></div> : <></>}
					{((state.modal.level >= 2) && (state.secondaryPowerset.Powers.find(pwr => pwr.Level <= state.modal.level))) ? <div onClick={selectSecondaryPowerset} className={(state.secondaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""} title={state.secondaryPowerset.Description}><img src={getIcon(state.secondaryPowerset)} alt="" /> <b>{state.secondaryPowerset.DisplayName}</b></div> : <></> }
					{powerPools.map((poolSet, index) => {
						return (<div key={"pool" + index} onClick={() => {selectPowerset(poolSet); }} className={(poolSet.nID === selectedPowerset?.nID) ? "selected" : ""} title={poolSet.Description}><img src={getIcon(poolSet)} alt="" /> {poolSet.DisplayName}</div>);
					})}
					{epicPools.map((poolSet, index) => {
						return (<div key={"pool" + index} onClick={() => {selectPowerset(poolSet); }} className={(poolSet.nID === selectedPowerset?.nID) ? "selected" : ""} title={poolSet.Description}><img src={getIcon(poolSet)} alt="" /> <i>{poolSet.DisplayName}</i></div>);
					})}
					{(state.powers[state.modal.level]) ? <div onClick={setClearList} className={"spaceMe" + ((selectedPowerset?.nID === -1) ? " selected" : "")}><i>Remove Power</i></div> : <></>}
				</div>
				<div id="selectPowerList" className={"builderInset" + ((showSelectedPowers) ? "" : " hideMobile")}>
					<div>
						{powerList.map(item => {
							var hasTaken = Object.entries(state.powers).find(testMe => { return testMe[1].powerData?.PowerIndex === item.PowerIndex});
							return (<div key={item.PowerIndex} className={((hasTaken) ? "taken " : "") + ((state.powers[state.modal.level]?.powerData.PowerIndex === item.PowerIndex) ? "selected" : "") } title={item.DescShort} onClick={() => { clickPower(item); }} onMouseEnter={() => { highlightPower(item); }} onMouseLeave={() => { setDisplayedPower(state.powers[state.modal.level]?.powerData); }}>{item.DisplayName}</div>);
						})}
						<div className="mobileOnly spaceMe" onClick={backToPowersets}>◄ <i>Go Back</i></div>
					</div>
					{(displayedPower) ?
					<div id="powerInfo" className="builderInset">
						<div className="header">
							<div><strong>{displayedPower.DisplayName}</strong></div>
							{(state.powers[state.modal.level]?.powerData.PowerIndex !== displayedPower.PowerIndex) ? (<i className="mobileOnly">Tap again to add power.</i>) : <></>}
						</div>
						<div>{displayedPower.DescLong}</div>
					</div>
					: <></>}
				</div>
			</div>
		</div>
	);
}

export default ModalSelectPower;