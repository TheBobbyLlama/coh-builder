//import { useStoreContext } from "../../utils/GlobalState";

import "./EnhancementInfo.css";

function EnhancementInfo({enhancement}) {
//	const [state,] = useStoreContext();

	return (
		<>
			{(enhancement) ?
			<div id="enhancementInfo" className="builderInset">
				<div className="header">
					<strong>{enhancement.LongName}</strong>
				</div>
			</div>
			: <></>}
		</>
	);
}

export default EnhancementInfo;