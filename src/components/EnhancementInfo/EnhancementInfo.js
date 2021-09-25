import { useStoreContext } from "../../utils/GlobalState";

import "./EnhancementInfo.css";

function EnhancementInfo({enhancement, slotIndex, warning}) {
	const [state,] = useStoreContext();

	const getMessage = () => {
		switch (warning) {
			case "duplicate":
				return (<i>WARNING - This enhancement has already been placed.</i>);
			default:
				return (<i className="mobileOnly">Tap again to apply enhancement.</i>);
		}
	}

	const getRarity = () => {
		if (enhancement.RecipeName.indexOf("Superior") > -1) {
			return 3;
		} else if (enhancement.RecipeName.indexOf("Rare") > -1) {
			return 2;
		} else if (enhancement.RecipeName.indexOf("Uncommon") > -1) {
			return 1;
		} else {
			return enhancement.Rarity;
		}
	}

	return (
		<>
			{(enhancement) ?
			<div id="enhancementInfo" className="builderInset">
				<div className="header">
					<div><strong className={("Rarity" + getRarity())}>{enhancement.LongName}</strong></div>
					{(state.modal?.powerInfo?.slots[slotIndex] !== enhancement) ? getMessage() : <></>}
				</div>
			</div>
			: <></>}
		</>
	);
}

export default EnhancementInfo;