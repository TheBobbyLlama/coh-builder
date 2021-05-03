import React, { createContext, useContext } from "react";
import { useBuilderReducer } from './reducers';

const StoreContext = createContext();
const { Provider } = StoreContext;

const StoreProvider = ({ value = [], ...props }) => {
	// Set default state here.
	const [state, dispatch] = useBuilderReducer({
		environment: localStorage.getItem("environment") || "homecoming",
		theme: localStorage.getItem("theme") || "Hero",
		page: 0
	  });
	return <Provider value={[state, dispatch]} {...props} />;
};

const useStoreContext = () => {
	return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };