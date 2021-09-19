import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_ARCHETYPE, MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";

import "./ModalLeaveDesigner.css";

function ModalLeaveDesigner() {
	const [,dispatch] = useStoreContext();

	const confirm = () => {
		dispatch({ type: SELECT_ARCHETYPE });
	}

	const cancel = () => {
		dispatch({ type: SHOW_MODAL, modal: MODAL_HIDE });
	}

	return (
		<div id="modalLeaveDesigner" className="builderPanel">
			<h2>Confirm</h2>
			<p>Are you sure you want to leave?  Your changes will be lost.</p>
			<div>
				<button type="button" className="pretty" onClick={confirm}>Ok</button>
				<button type="button" className="pretty" onClick={cancel}>Cancel</button>
			</div>
		</div>
	);
}

export default ModalLeaveDesigner;