import { useEffect } from "react";
import { useStoreContext } from "../../utils/GlobalState";
import { LOAD_POWER_POOL } from "../../utils/actions";

function PoolLoaderAsync() {
	const [state,dispatch] = useStoreContext();

	// useEffect here means that if the power pool list is reloaded from changing environment, the pools will be reloaded automatically.
	useEffect(() => {
		var poolAtlas = require("../../data/" + state.environment + "/PowerPools.json");

		poolAtlas.forEach(async (item, index) => {
			if (item.GroupName) {
				var setName = item.FileName || item.DisplayName.replaceAll(" ", "_");
				let powerPool = require("../../data/" + state.environment + "/db/Other/_" + item.GroupName + "." + setName + ".json");

				dispatch({ type: LOAD_POWER_POOL, powerPool });
			}
		})
	 }, [ state.environment, dispatch ]);

	return (
		<></>
	);
}

export default PoolLoaderAsync;