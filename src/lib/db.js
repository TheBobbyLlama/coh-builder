export const initializeDataset = (environment) => {
	var powersetAtlas = require("../data/" + environment + "/PowerSets.json");
	var poolAtlas = require("../data/" + environment + "/PowerPools.json");
	return [powersetAtlas, poolAtlas];
}

export const getArchetypeData = (environment) => {
	var result = require("../data/" + environment + "/I12.json");

	if (result) {
		return result.Archetypes.filter(curAt => curAt.Playable);
	} else {
		return [];
	}
};