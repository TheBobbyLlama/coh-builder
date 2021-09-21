import { useStoreContext } from "../../utils/GlobalState";
import { SHOW_MODAL, MODAL_SELECT_POWER } from "../../utils/actions";
import { validPoolPower } from "../../utils/util";

import SlotWidget from "../SlotWidget/SlotWidget";

import "./PowerWidget.css";

function PowerWidget({ label, target, allowChange }) {
	const [state, dispatch] = useStoreContext();

	const determineValidPower = () => {
		if ((!target) || (!state.powers) || ((target.powerData.GroupName !== "Pool") && (target.powerData.GroupName !== "Epic"))) {
			return true;
		} else {
			return validPoolPower(target.powerData, label, state.powers);
		}
	}

	const selectPower = () => {
		if (allowChange) {
			dispatch({ type: SHOW_MODAL, modal: { key: MODAL_SELECT_POWER, level: label }})
		}
	}

	return (
		<div className={"powerWidget" + ((target) ? "" : " empty") + ((allowChange) ? "" : " locked")} title={(target?.powerData?.DescShort) ? target.powerData.DescShort : ""} onClick={selectPower}>
			<div>
				{label || ""}
			</div>
			<div className={(determineValidPower()) ? "" : "invalid"}>
				{target?.powerData?.DisplayName || <i>Click to Add a Power</i>}
			</div>
			<div>
				<></>
			</div>
			{(target?.slots?.length) ? 
				<div className="slotHolder">
					<SlotWidget target={target} />
				</div> : <></>}
		</div>
	);
}

export default PowerWidget;