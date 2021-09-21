import { useStoreContext } from "../../utils/GlobalState";

import "./PowerPoolReadout.css";

function PowerPoolReadout() {
	const [state,] = useStoreContext();

	const displayPool = (pool) => {
		const setIcon = require("../../assets/images/powersets/" + pool.ImageName)?.default;
		return (<div key={pool.nID}><img src={setIcon} alt="" /> {pool.DisplayName}</div>);
	}

	return (
		<div id="powerPools" className="builderInset">
			<div className="titleHolder">
				<h4>Pools</h4>
			</div>
			<div id="poolList">
				{state.pools.map(displayPool)}
				{(state.epicPool) ? displayPool(state.epicPool) : <></>}
			</div>
		</div>
	);
}

export default PowerPoolReadout;