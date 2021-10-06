import { useStoreContext } from "../../utils/GlobalState";
import {
	MODAL_ERROR,
	MODAL_LEAVE_DESIGNER,
	MODAL_SELECT_POWER,
	MODAL_ENHANCE_POWER,
	MODAL_SELECT_ACCOLADE,
	MODAL_SELECT_INCARNATE,
	MODAL_EXPORT_CHARACTER
} from "../../utils/actions";

import ModalError from "../ModalError/ModalError";
import ModalLeaveDesigner from "../ModalLeaveDesigner/ModalLeaveDesigner";
import ModalSelectPower from "../ModalSelectPower/ModalSelectPower";
import ModalEnhancePower from "../ModalEnhancePower/ModalEnhancePower";
import ModalAccoladeSelection from "../ModalAccoladeSelection/ModalAccoladeSelection";
import ModalExportCharacter from "../ModalExportCharacter/ModalExportCharacter";

import "./ModalManager.css";
import ModalIncarnateSelection from "../ModalIncarnateSelection/ModalIncarnateSelection";

function ModalManager() {
	const [state,] = useStoreContext();

	return (
		<>
			{(state.modal?.key) ? <div className={"modalBG " + state.theme}>
				{(state.modal.key === MODAL_ERROR) ? <ModalError /> : <></>}
				{(state.modal.key === MODAL_LEAVE_DESIGNER) ? <ModalLeaveDesigner /> : <></>}
				{(state.modal.key === MODAL_SELECT_POWER) ? <ModalSelectPower /> : <></>}
				{(state.modal.key === MODAL_ENHANCE_POWER) ? <ModalEnhancePower /> : <></>}
				{(state.modal.key === MODAL_SELECT_ACCOLADE) ? <ModalAccoladeSelection /> : <></>}
				{(state.modal.key === MODAL_SELECT_INCARNATE) ? <ModalIncarnateSelection /> : <></>}
				{(state.modal.key === MODAL_EXPORT_CHARACTER) ? <ModalExportCharacter /> : <></>}
			</div> : <></>}
		</>
	);
}

export default ModalManager;