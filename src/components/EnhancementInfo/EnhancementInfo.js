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

	return (
		<>
			{(enhancement) ?
			<div id="enhancementInfo" className="builderInset">
				<div className="header">
					<div><strong>{enhancement.LongName}</strong></div>
					{(state.modal?.powerInfo?.slots[slotIndex] !== enhancement) ? getMessage() : <></>}
				</div>
			</div>
			: <></>}
		</>
	);
}

export default EnhancementInfo;