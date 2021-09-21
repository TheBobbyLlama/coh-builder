import { useStoreContext } from "../../utils/GlobalState";
import { ADD_SLOT_TO_POWER } from "../../utils/actions";

import Enhancement from "../Enhancement/Enhancement";

import "./SlotWidget.css";

function SlotWidget({ target, clickFunc, selectedIndex, showAdd }) {
	const [state, dispatch] = useStoreContext();

	const addSlot = (event) => {
		event.stopPropagation();
		clickFunc(target.slots.length);
		dispatch({ type: ADD_SLOT_TO_POWER, powerInfo: target });
	}

	return (
		<div className="slotWidget">
			{target.slots.map((item, index) => {
				return ((index === selectedIndex) ?
				<div key={index} className="selected"><Enhancement enhancement={item} /></div> :
				<div key={index}  onClick={(event) => { event.stopPropagation(); clickFunc(index); }}><Enhancement enhancement={item} /></div>);
			})}
			{((showAdd) && (target.slots.length < 6) && (state.slotCount < state.slotMax)) ?
				<div className="addMe" onClick={addSlot}>+</div> : <></>
			}
		</div>
	);
}

export default SlotWidget;