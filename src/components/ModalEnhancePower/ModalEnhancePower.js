import { useStoreContext } from "../../utils/GlobalState";
import { useState } from "react";
import { MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";

import SlotWidget from "../SlotWidget/SlotWidget";

import "./ModalEnhancePower.css";

function ModalEnhancePower() {
	const [state,dispatch] = useStoreContext();
	const [slotIndex, setSlotIndex] = useState(state.modal.slotIndex);

	const clickEnhancement = (index) => {
		setSlotIndex(index);
	}

	const done = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_HIDE } });
	}

	return (
		<div id="modalEnhancePower" className="builderPanel">
			<div id="enhanceHeader">
				<h3>Enhancing {state.modal.powerInfo.powerData.DisplayName}</h3>
				<button type="button" className="pretty cancel" onClick={done}>X</button>
			</div>
			<div id="widgetHolder">
				<SlotWidget
					target={state.modal.powerInfo}
					clickFunc={clickEnhancement}
					selectedIndex={slotIndex}
					showAdd={true}
				/>
			</div>
		</div>
	);
}

export default ModalEnhancePower;