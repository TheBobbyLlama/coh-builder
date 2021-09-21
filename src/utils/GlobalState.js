import React, { createContext, useContext } from "react";
import { initializeDataset } from "../lib/db";
import { PAGE_MAIN_MENU } from "./actions";
import { useBuilderReducer } from "./reducers";

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	let environment = localStorage.getItem("environment") || "homecoming";
	let [powerData, poolData] = initializeDataset(environment);
	// Set default state here.
	const [state, dispatch] = useBuilderReducer({
		characterName: "",
		environment,
		theme: "Hero",
		page: PAGE_MAIN_MENU,
		powerData,
		poolData,
		powers: {},
		pools: [],
		slotCount: 0,
		slotMax: 67
	});
	// NOTE: Any character related defaults also need to be set in reducers.js -> clearCharacterData!
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };