import { useStoreContext } from "../../utils/GlobalState";
import { MODAL_LEAVE_DESIGNER, MODAL_SELECT_POWER, MODAL_ENHANCE_POWER } from "../../utils/actions";

import ModalLeaveDesigner from "../ModalLeaveDesigner/ModalLeaveDesigner";
import ModalSelectPower from "../ModalSelectPower/ModalSelectPower";
import ModalEnhancePower from "../ModalEnhancePower/ModalEnhancePower";

import "./ModalManager.css";

function ModalManager() {
	const [state,] = useStoreContext();

	return (
		<>
			{(state.modal?.key) ? <div className={"modalBG " + state.theme}>
				{(state.modal.key === MODAL_LEAVE_DESIGNER) ? <ModalLeaveDesigner /> : <></>}
				{(state.modal.key === MODAL_SELECT_POWER) ? <ModalSelectPower /> : <></>}
				{(state.modal.key === MODAL_ENHANCE_POWER) ? <ModalEnhancePower /> : <></>}
			</div> : <></>}
		</>
	);
}

export default ModalManager;