import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_POWER, SHOW_MODAL, MODAL_HIDE } from "../../utils/actions";

import "./ModalSelectPower.css";

function ModalSelectPower() {
	const [state, dispatch] = useStoreContext();
	const [selectedPowerset, setSelectedPowerset] = useState(state.primaryPowerset);
	const [powerList, setPowerList] = useState(state.primaryPowerset.Powers.filter(item => item?.Level <= state.modal.level));
	const [showSelectedPowers, setShowSelectedPowers] = useState(false); // TODO - Will be used for mobile viewing!

	const cancel = () => {
		dispatch({ type: SHOW_MODAL, modal: MODAL_HIDE });
	};

	const selectPrimaryPowerset = () => {
		setSelectedPowerset(state.primaryPowerset);
		setPowerList(state.primaryPowerset.Powers.filter(item => item?.Level <= state.modal.level));
	};

	const selectSecondaryPowerset = () => {
		setSelectedPowerset(state.secondaryPowerset);
		setPowerList(state.secondaryPowerset.Powers.filter(item => item?.Level <= state.modal.level && item.Level > 1));
	};
	
	const setClearList = () => {
		setSelectedPowerset({ nID: -1 });
		setPowerList([ { DisplayName: "Remove Power", PowerIndex: -1 }]);
	};

	const choosePower = (power) => {
		dispatch({ type: SELECT_POWER, level: state.modal.level, power });
	};

	return (
		<div id="modalSelectPower" className="builderPanel">
			<div id="modalCloseHolder">
				<button type="button" className="pretty cancel" onClick={cancel}>X</button>
			</div>
			<h3>Select Power</h3>
			<div id="powerSelectionPanel">
				<div id="powersetList" className="builderInset">
					<div onClick={selectPrimaryPowerset} className={(state.primaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""}>{state.primaryPowerset.DisplayName}</div>
					<div onClick={selectSecondaryPowerset} className={(state.secondaryPowerset.nID === selectedPowerset?.nID) ? "selected" : ""}>{state.secondaryPowerset.DisplayName}</div>
					{(state.powers[state.modal.level]) ?
					<div onClick={setClearList} className={(selectedPowerset?.nID === -1) ? "selected" : ""}><i>Remove Power</i></div> : <></>
					}
				</div>
				<div id="powerList" className="builderInset">
					{powerList.map(item => {
						var hasTaken = Object.entries(state.powers).find(testMe => { return testMe[1].powerData?.PowerIndex === item.PowerIndex});
						return (<div key={item.PowerIndex} className={(hasTaken) ? "taken" : "" } onClick={() => { choosePower(item); }}>{item.DisplayName}</div>);
					})}
				</div>
			</div>
		</div>
	);
}

export default ModalSelectPower;