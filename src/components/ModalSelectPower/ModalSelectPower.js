import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_POWER, SHOW_MODAL, MODAL_HIDE } from "../../utils/actions";

import "./ModalSelectPower.css";

function ModalSelectPower() {
	const findSelectedPowerset = () => {
		const curPower = state.powers[state.modal.level]?.powerData;

		if (curPower) {
			if ((curPower.GroupName === "Pool") || (curPower.GroupName === "Epic")) {
				return state.poolData.find(poolSet => poolSet.nID === curPower.PowerSetID);
			} else if (curPower.GroupName === state.secondaryPowerset.GroupName) {
				return state.secondaryPowerset;
			}
		}

		return state.primaryPowerset;
	};

	const [state, dispatch] = useStoreContext();
	const [selectedPowerset, setSelectedPowerset] = useState(findSelectedPowerset());
	const [powerList, setPowerList] = useState(selectedPowerset.Powers.filter(item => item?.Level <= state.modal.level));
	const [showSelectedPowers, setShowSelectedPowers] = useState(false); // TODO - Will be used for mobile viewing!

	const cancel = () => {
		dispatch({ type: SHOW_MODAL, modal: MODAL_HIDE });
	};

	const selectPrimaryPowerset = () => {
		setSelectedPowerset(state.primaryPowerset);
		setPowerList(state.primaryPowerset.Powers.filter(item => item?.Level <= state.modal.level));
		setShowSelectedPowers(true);
	};

	const selectSecondaryPowerset = () => {
		setSelectedPowerset(state.secondaryPowerset);
		setPowerList(state.secondaryPowerset.Powers.filter(item => item?.Level <= state.modal.level && item.Level > 1));
		setShowSelectedPowers(true);
	};

	const selectPoolPowerset = (set) => {
		setSelectedPowerset(set);
		setPowerList(set.Powers.filter(item => item?.Level <= state.modal.level && item.Level > 1));
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

	const powerPools = ((state.pools.length >= 4) ? state.pools.map(item => item.pool) : state.poolData.filter(set => set.GroupName === "Pool")).filter(set => set.Powers.find(power => power.Level <= state.modal.level));

	return (
		<div id="modalSelectPower" className="builderPanel">
			<div id="modalCloseHolder">
				<button type="button" className="pretty cancel" onClick={cancel}>X</button>
			</div>
			<h3>Select Power</h3>
			<div id="powerSelectionPanel">
				<div id="powersetList" className={"builderInset" + ((showSelectedPowers) ? " hideMobile" : "")}>
					<div onClick={selectPrimaryPowerset} className={(state.primaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""}><b>{state.primaryPowerset.DisplayName}</b></div>
					{(state.modal.level >= 2) ? <div onClick={selectSecondaryPowerset} className={(state.secondaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""}><b>{state.secondaryPowerset.DisplayName}</b></div> : <></> }
					{powerPools.map((poolSet, index) => {
						return (<div key={"pool" + index} onClick={() => {selectPoolPowerset(poolSet); }} className={(poolSet.nID === selectedPowerset?.nID) ? "selected" : ""}>{poolSet.DisplayName}</div>);
					})}
					{(state.powers[state.modal.level]) ? <div onClick={setClearList} className={"spaceMe" + ((selectedPowerset?.nID === -1) ? " selected" : "")}><i>Remove Power</i></div> : <></>}
				</div>
				<div id="powerList" className={"builderInset" + ((showSelectedPowers) ? "" : " hideMobile")}>
					{powerList.map(item => {
						var hasTaken = Object.entries(state.powers).find(testMe => { return testMe[1].powerData?.PowerIndex === item.PowerIndex});
						return (<div key={item.PowerIndex} className={((hasTaken) ? "taken " : "") + ((state.powers[state.modal.level]?.powerData.PowerIndex === item.PowerIndex) ? "selected" : "") } title={item.DescShort} onClick={() => { choosePower(item); }}>{item.DisplayName}</div>);
					})}
					<div className="mobileOnly spaceMe" onClick={() => { setShowSelectedPowers(false); }}>◄ <i>Go Back</i></div>
				</div>
			</div>
		</div>
	);
}

export default ModalSelectPower;