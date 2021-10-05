import { useStoreContext } from "../../utils/GlobalState";
import { MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";

import "./ModalError.css";

function ModalError() {
	const [state, dispatch] = useStoreContext();

	const done = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_HIDE } });
	}

	return (
		<div id="modalError" className="builderPanel">
			<h2>Error!</h2>
			{state.modal.message.split("\n").map((str, index) => {
				return (<p key={index}>{str}</p>);
			})}
			<div>
				<button type="button" className="pretty cancel" onClick={done}>Ok</button>
			</div>
		</div>
	);
}

export default ModalError;