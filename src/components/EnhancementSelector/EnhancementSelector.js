import { useStoreContext } from "../../utils/GlobalState";
import { useState, useEffect, useCallback } from "react";
import { APPLY_ENHANCEMENT_TO_POWER } from "../../utils/actions";

import Enhancement from "../Enhancement/Enhancement";
import EnhancementInfo from "../EnhancementInfo/EnhancementInfo";

import "./EnhancementSelector.css";

function EnhancementSelector({slotIndex}) {
	const [state,dispatch] = useStoreContext();

	const getCurrentEnhancementType = useCallback((defaultValue=0) => {
		const testMe = state.modal.powerInfo?.slots[slotIndex];

		if (testMe) {
			return testMe.TypeID;
		} else {
			return defaultValue;
		}
	}, [state.modal.powerInfo, slotIndex]);

	const [selectedEnhancement, setSelectedEnhancement] = useState(state.modal.powerInfo?.slots[slotIndex]);
	const [displayedEnhancement, setDisplayedEnhancement] = useState(selectedEnhancement);
	const [currentType, setCurrentType] = useState(getCurrentEnhancementType());
	const [currentCategory, setCurrentCategory] = useState();

	useEffect(() => {
		getCurrentEnhancementType(state.modal.powerInfo?.slots[slotIndex]?.TypeID);
		setSelectedEnhancement(state.modal.powerInfo.slots[slotIndex]);
		setDisplayedEnhancement(state.modal.powerInfo.slots[slotIndex]);
	}, [ state.modal.powerInfo, slotIndex, getCurrentEnhancementType, currentType ]);

	const getSetCategories = () => {
		switch(currentType) {
			case 3: // HamiOs
				const tmpList =  state.enhancementData.filter((value, index, self) => {
					return ((value.TypeID === 3) &&
							(self.findIndex(item => item.SubTypeID === value.SubTypeID) === index));
				});
				
				return tmpList.map(item => {
					const shortName = item.UID.split("_")[0];
					return {
						LongName: shortName,
						Image: (shortName + ".png"),
						SubTypeID: item.SubTypeID
					}
				});
			case 4: // Set IOs
				return []
			default:
				return [];
		}
	}

	const getEnhancementList = () => {
		switch (currentType) {
			case -1: // Special functions
				const result = [];

				if (state.modal.powerInfo.slots[slotIndex]) {
					result.push({ StaticIndex: -1, TypeID: -1, LongName: "Clear This Slot", SpecialText: "Clear"});
				}

				if (slotIndex > 0) {
					result.push({ StaticIndex: -2, TypeID: -1, LongName: "Remove This Slot", SpecialText: "Remove"});
				}

				return result;
			case 2: // Plain IOs
				return state.enhancementData.filter(enh => ((enh.TypeID === currentType) && (state.modal.powerInfo.powerData.Enhancements.filter(testMe => enh.ClassID.indexOf(testMe - 1) > -1).length)));
			case 3: // HamiOs
				return state.enhancementData.filter(enh => ((enh.TypeID === currentType) && (enh.SubTypeID === currentCategory)));
			case 4: // Set IOs
				return [];
			default:
				return [];
		}
	}

	const setSelectedEnhancementType = (newType) => {
		setCurrentType(newType);
		setCurrentCategory(undefined);
		setSelectedEnhancement(state.modal.powerInfo.slots[slotIndex]);
		setDisplayedEnhancement(state.modal.powerInfo.slots[slotIndex]);
	}

	const setSelectedCategory = (newCategory) => {
		setSelectedEnhancement(state.modal.powerInfo.slots[slotIndex]);
		setDisplayedEnhancement(state.modal.powerInfo.slots[slotIndex]);

		switch (currentType) {
			case 3:
				setCurrentCategory(newCategory.SubTypeID);
				break;
			case 4:
				setCurrentCategory("TODO");
				break;
			default:
				setCurrentCategory(undefined);
		}
	}

	const enhancementSetCategories = getSetCategories();
	const enhancementList = getEnhancementList();

	const getClearRemoveCategory = () => {
		var flags = 0;

		if (slotIndex > 0) {
			flags += 1;
		}

		if (state.modal.powerInfo.slots[slotIndex]) {
			flags += 2;
		}

		switch (flags) {
			case 1:
				return (<div className={(currentType === -1) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(-1); }}><Enhancement enhancement={{ TypeID: -1, LongName: "Remove", SpecialText: "X" }} /></div>);
			case 2:
				return (<div className={(currentType === -1) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(-1); }}><Enhancement enhancement={{ TypeID: -1, LongName: "Clear", SpecialText: "X" }} /></div>);
			case 3:
				return (<div className={(currentType === -1) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(-1); }}><Enhancement enhancement={{ TypeID: -1, LongName: "Clear or Remove", SpecialText: "X" }} /></div>);
			default:
				return (<></>);
		}
	}

	const clickEnhancement = (enhancement) => {
		if ((displayedEnhancement) && (enhancement.StaticIndex === displayedEnhancement.StaticIndex)) {
			dispatch({type: APPLY_ENHANCEMENT_TO_POWER, enhancement: selectedEnhancement, powerInfo: state.modal.powerInfo, slotIndex });
		} else {
			setSelectedEnhancement(enhancement);
			setDisplayedEnhancement(enhancement);
		}
	}

	return (
		<div id="enhancementSelector" className="builderInset">
			<div id="enhancementSets">
				<div id="enhancementTabs">
					{(state.modal.powerInfo.powerData.Enhancements.length) ?
						<>
							<div className={(currentType === 2) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(2); }}><Enhancement enhancement={{ Image: "InventO.png", LongName: "Invention" }} pathOverride="sets" /></div>
							<div className={(currentType === 3) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(3); }}><Enhancement enhancement={{ Image: "HamiO.png", LongName: "Hamidon"}} pathOverride="sets" /></div>
						</>
					: <></>}
					{(state.modal.powerInfo.powerData.SetTypes.length) ?
						<div className={(currentType === 4) ? "selected" : ""} onClick={() => { setSelectedEnhancementType(4); }}><Enhancement enhancement={{ Image: "SetO.png", LongName: "Invention Set" }} pathOverride="sets" /></div>
					: <></>}
					{getClearRemoveCategory()}
				</div>
				{(enhancementSetCategories?.length) ?
				<div id="setCategories">
					{enhancementSetCategories.map((category, index) => {
						return (<div key={index} className={(((category.SubTypeID) && (currentCategory === category.SubTypeID))) ? "selected" : ""} onClick={() => { setSelectedCategory(category); }}><Enhancement enhancement={category} pathOverride="sets" /></div>);
					})}
				</div>
				: <></>}
			</div>
			<div id="enhancementPanel">
				<div id="enhancementList">
					{enhancementList.map((item, index) => {
						return (<div key={index} className={((selectedEnhancement) && (item.StaticIndex === selectedEnhancement.StaticIndex)) ? "selected" : ""} onClick={() => { clickEnhancement(item); }}><Enhancement enhancement={item} /></div>)
					})}
				</div>
				<EnhancementInfo enhancement={displayedEnhancement} />
			</div>
		</div>
	);
}

export default EnhancementSelector;