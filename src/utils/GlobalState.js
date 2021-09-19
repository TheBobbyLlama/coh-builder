import React, { createContext, useContext } from "react";
import { initializeDataset } from "../lib/db";
import { PAGE_MAIN_MENU } from "./actions";
import { useBuilderReducer } from "./reducers";

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	// Set default state here.
	const [state, dispatch] = useBuilderReducer({
		characterName: "",
		environment: localStorage.getItem("environment") || "homecoming",
		theme: "Hero",
		page: PAGE_MAIN_MENU,
		dataset: initializeDataset("homecoming"),
		powers: {}
	  });
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };