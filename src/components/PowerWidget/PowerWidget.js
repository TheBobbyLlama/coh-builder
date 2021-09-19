import SlotWidget from "../SlotWidget/SlotWidget";

import "./PowerWidget.css";

function PowerWidget({ label, target, allowChange }) {
	return (
		<div className={"powerWidget" + ((target) ? "" : " empty") + ((allowChange) ? "" : " locked")}>
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