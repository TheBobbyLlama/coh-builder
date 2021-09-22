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
		} else {
			return [];
		}
	}

	const [selectedPowerset, setSelectedPowerset] = useState(findSelectedPowerset());
	const [powerList, setPowerList] = useState(findSelectedPowerList(selectedPowerset));
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

	const selectPoolPowerset = (set) => {
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

	const choosePower = (power) => {
		dispatch({ type: SELECT_POWER, level: state.modal.level, power });
	};

	const backToPowersets = () => {
		setSelectedPowerset(findSelectedPowerset());
		setShowSelectedPowers(false);
	}

	const getIcon = (item) => {
		var icon = require("../../assets/images/powersets/" + item.ImageName)?.default;
		return icon;
	}

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
					<div onClick={selectPrimaryPowerset} className={(state.primaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""} title={state.primaryPowerset.Description}><img src={getIcon(state.primaryPowerset)} alt="" /> <b>{state.primaryPowerset.DisplayName}</b></div>
					{(state.modal.level >= 2) ? <div onClick={selectSecondaryPowerset} className={(state.secondaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""} title={state.secondaryPowerset.Description}><img src={getIcon(state.secondaryPowerset)} alt="" /> <b>{state.secondaryPowerset.DisplayName}</b></div> : <></> }
					{powerPools.map((poolSet, index) => {
						return (<div key={"pool" + index} onClick={() => {selectPoolPowerset(poolSet); }} className={(poolSet.nID === selectedPowerset?.nID) ? "selected" : ""} title={poolSet.Description}><img src={getIcon(poolSet)} alt="" /> {poolSet.DisplayName}</div>);
					})}
					{epicPools.map((poolSet, index) => {
						return (<div key={"pool" + index} onClick={() => {selectPoolPowerset(poolSet); }} className={(poolSet.nID === selectedPowerset?.nID) ? "selected" : ""} title={poolSet.Description}><img src={getIcon(poolSet)} alt="" /> <i>{poolSet.DisplayName}</i></div>);
					})}
					{(state.powers[state.modal.level]) ? <div onClick={setClearList} className={"spaceMe" + ((selectedPowerset?.nID === -1) ? " selected" : "")}><i>Remove Power</i></div> : <></>}
				</div>
				<div id="powerList" className={"builderInset" + ((showSelectedPowers) ? "" : " hideMobile")}>
					{powerList.map(item => {
						var hasTaken = Object.entries(state.powers).find(testMe => { return testMe[1].powerData?.PowerIndex === item.PowerIndex});
						return (<div key={item.PowerIndex} className={((hasTaken) ? "taken " : "") + ((state.powers[state.modal.level]?.powerData.PowerIndex === item.PowerIndex) ? "selected" : "") } title={item.DescShort} onClick={() => { choosePower(item); }}>{item.DisplayName}</div>);
					})}
					<div className="mobileOnly spaceMe" onClick={backToPowersets}>◄ <i>Go Back</i></div>
				</div>
			</div>
		</div>
	);
}

export default ModalSelectPower;