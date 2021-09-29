import { useState } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { SELECT_INCARNATE, MODAL_HIDE, SHOW_MODAL } from "../../utils/actions";

import "./ModalIncarnateSelection.css";

function ModalIncarnateSelection() {
	const incarnateSets = [];
	const [state, dispatch] = useStoreContext();
	const [showSelectionList, setShowSelectionList] = useState(false);

	Object.entries(state.miscData.Incarnates).forEach(info => {
		incarnateSets.push(state.powersetData.find(set => set.FullName === ("Incarnate." + info[0])));
	});

	const [curSet, setCurSet] = useState((incarnateSets.length) ? incarnateSets[0] : undefined);
	const [curType, setCurType] = useState(undefined);
	const [displayedIncarnate, setDisplayedIncarnate] = useState(undefined);

	const done = () => {
		dispatch({ type: SHOW_MODAL, modal: { key: MODAL_HIDE } });
	}

	const chooseSet = (set) => {
		setCurSet(set);
		setCurType(undefined);
		setDisplayedIncarnate(undefined);
	}

	const chooseType = (newType) => {
		setCurType(newType);
		setDisplayedIncarnate(undefined);
		setShowSelectionList(true);
	}

	const highlightIncarnate = (incarnate) => {
		if ((incarnate) && (window.screen.width >= 680)) {
			setDisplayedIncarnate(incarnate);
		}
	}

	const setIncarnate = (incarnate, hasIncarnate) => {
		if (incarnate === displayedIncarnate) {
			if (hasIncarnate) {
				dispatch({ type: SELECT_INCARNATE, set: curSet.SetName });
			}  else {
				dispatch({ type: SELECT_INCARNATE, incarnate, set: curSet.SetName });
			}
		} else {
			setDisplayedIncarnate(incarnate);
		}
	}

	return (
		<div id="modalIncarnateSelection" className="builderPanel">
			<button id="closeButton" type="button" className="pretty cancel" onClick={done}>X</button>
			<h2>Incarnate Selection</h2>
			<div id="incarnateSets" className={"builderInset" + ((showSelectionList) ? " hideMobile" : "")}>
				{Object.entries(state.miscData.Incarnates).map((info, index) => {
					let set = incarnateSets[index];
					return (<button key={set.SetName} type="button" className={"pretty " + ((set === curSet) ? " selected" : "")} disabled={!info[1].length} onClick={() => { chooseSet(set); }}>{set.DisplayName}</button>)
				})}
			</div>
			<div id="incarnateSubtypes" className={"builderInset" + ((showSelectionList) ? " hideMobile" : "")}>
				{(curSet) ?
					<>
					{state.miscData.Incarnates[curSet.SetName].map(item => {
						return (<button key={item} type="button" className={"pretty" + ((curType === item) ? " selected" : "")} onClick={() => { chooseType(item); }}>{item}</button>)
					})}
					</>
				: <></>}
			</div>
			<div id="incarnatePowers" className={"builderInset" + ((showSelectionList) ? "" : " hideMobile")}>
				{(curType) ?
					<>
					{curSet.Powers.filter(power => power.PowerName.startsWith(curType.replace(/ /g, "_"))).map(power => {
						let hasIncarnate = (state.powers["Incarnate" + curSet.SetName]?.powerData?.PowerIndex === power.PowerIndex);
						return (<div key={power.PowerIndex} className={(hasIncarnate) ? "selected" : ""} onClick={() => { setIncarnate(power, hasIncarnate); }} onMouseEnter={() => { highlightIncarnate(power); }}>{power.DisplayName}</div>)
					})}
					</>
				:<></>}
				<div className="mobileOnly" onClick={() => { setShowSelectionList(false); }}>◄ <i>Go Back</i></div>
			</div>
			<div id="incarnateInfo" className={"builderInset" + ((showSelectionList) ? "" : " hideMobile")}>
				{(displayedIncarnate) ?
				<>
					<h4>{displayedIncarnate.DisplayName}</h4>
					<p className="mobileOnly"><i>Tap again to add/remove</i></p>
					<p>{displayedIncarnate.DescLong.replace(/<br>/g, "\n\n")}</p>
				</> : <></>}
			</div>
		</div>
	);
}

export default ModalIncarnateSelection;