import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_ACCOLADE, MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";
import { findPower } from "../../utils/util";

import "./ModalAccoladeSelection.css";

function ModalAccoladeSelection() {
	const [state, dispatch] = useStoreContext();
	const [displayedAccolade, setDisplayedAccolade] = useState();

	const highlightAccolade = (accolade) => {
		if ((accolade) && (window.screen.width >= 680)) {
			setDisplayedAccolade(accolade);
		}
	}

	const setAccolade = (accolade, index, hasAccolade) => {
		if (accolade === displayedAccolade) {
			if (hasAccolade) {
				dispatch({ type: SELECT_ACCOLADE, index });
			}  else {
				dispatch({ type: SELECT_ACCOLADE, accolade, index });
			}
		} else {
			setDisplayedAccolade(accolade);
		}
	}

	const done = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_HIDE } });
	}

	const accoladeOffset = (state.theme === "Villain") ? 1 : 0;

	return (
		<div id="modalAccoladeSelection" className="builderPanel">
			<h2>Accolade Selection</h2>
			<div>
				<div className="builderInset">
					{state.miscData.Accolades.map((accoladeInfo, index) => {
						let hasAccolade = !!(state.powers["Accolade" + index]);
						let curAccolade = findPower(accoladeInfo[accoladeOffset], state.powersetData);
						return (<button type="button" className={"pretty" + ((hasAccolade) ? "" : " inactive")} title={curAccolade.DescShort} onClick={() => { setAccolade(curAccolade, index, hasAccolade); }} onMouseEnter={() => { highlightAccolade(curAccolade); }}>{curAccolade.DisplayName}</button>);
					})}
				</div>
				<div id="accoladeInfo" className="builderInset">
					{(displayedAccolade) ?
					<>
						<h4>{displayedAccolade.DisplayName}</h4>
						<p className="mobileOnly"><i>Tap again to add/remove</i></p>
						<p>{displayedAccolade.DescLong}</p>
					</>:<></>}
				</div>
				<button type="button" className="pretty confirm" onClick={done}>Ok</button>
			</div>
		</div>
	);
}

export default ModalAccoladeSelection;