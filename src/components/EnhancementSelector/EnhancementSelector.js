import { useStoreContext } from "../../utils/GlobalState";
import { useState, useEffect, useCallback } from "react";

import Enhancement from "../Enhancement/Enhancement";

import "./EnhancementSelector.css";

function EnhancementSelector({slotIndex}) {
	const [state,] = useStoreContext();

	const getCurrentEnhancementType = useCallback((defaultValue=2) => {
		const testMe = state.modal.powerInfo?.slots[slotIndex];

		if (testMe) {
			return testMe.TypeID;
		} else {
			return defaultValue;
		}
	}, [state.modal.powerInfo, slotIndex]);

	const [currentType, setCurrentType] = useState(getCurrentEnhancementType());

	useEffect(() => {
		getCurrentEnhancementType(currentType);
	 }, [ slotIndex, getCurrentEnhancementType, currentType ]);


	const setSelectedEnhancementType = (newType) => {
		setCurrentType(newType);
	}

	return (
		<div id="enhancementSelector" className="builderInset">
			<div id="enhancementSets">
				<div id="enhancementTabs">
					{(state.modal.powerInfo.powerData.Enhancements.length) ?
						<>
							<div className={(currentType === 2) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(2); }}><Enhancement enhancement={{ Image: "InventO.png", LongName: "Invention" }} useSets={true} /></div>
							<div className={(currentType === 3) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(3); }}><Enhancement enhancement={{ Image: "HamiO.png", LongName: "Hamidon"}} useSets={true} /></div>
						</>
					: <></>}
					{(state.modal.powerInfo.powerData.SetTypes.length) ?
						<div className={(currentType === 4) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(4); }}><Enhancement enhancement={{ Image: "SetO.png", LongName: "Invention Set" }} useSets={true} /></div>
					: <></>}
				</div>
			</div>
			<div id="enhancementList"></div>
		</div>
	);
}

export default EnhancementSelector;