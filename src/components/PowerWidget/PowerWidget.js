import { useStoreContext } from "../../utils/GlobalState";
import { SHOW_MODAL, MODAL_SELECT_POWER } from "../../utils/actions";

import SlotWidget from "../SlotWidget/SlotWidget";

import "./PowerWidget.css";

function PowerWidget({ label, target, allowChange }) {
	const [, dispatch] = useStoreContext();

	const selectPower = () => {
		if (allowChange) {
			dispatch({ type: SHOW_MODAL, modal: { key: MODAL_SELECT_POWER, level: label }})
		}
	}

	return (
		<div className={"powerWidget" + ((target) ? "" : " empty") + ((allowChange) ? "" : " locked")} onClick={selectPower}>
			<div>
				{label || ""}
			</div>
			<div>
				{target?.powerData?.DisplayName || <i>Click to Add a Power</i>}
			</div>
			<div>
				<input type="checkbox" />
			</div>
			{(target?.slots?.length) ? 
				<div className="slotHolder">
					<SlotWidget target={target} />
				</div> : <></>}
		</div>
	);
}

export default PowerWidget;