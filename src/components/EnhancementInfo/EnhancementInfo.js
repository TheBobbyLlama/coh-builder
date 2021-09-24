import { useStoreContext } from "../../utils/GlobalState";

import "./EnhancementInfo.css";

function EnhancementInfo({enhancement, slotIndex}) {
	const [state,] = useStoreContext();

	return (
		<>
			{(enhancement) ?
			<div id="enhancementInfo" className="builderInset">
				<div className="header">
					<div><strong>{enhancement.LongName}</strong></div>
					{(state.modal?.powerInfo?.slots[slotIndex] !== enhancement) ? (<i><span className="hideMobile">Click</span><span className="mobileOnly">Tap</span> again to apply enhancement.</i>) : <></>}
				</div>
			</div>
			: <></>}
		</>
	);
}

export default EnhancementInfo;