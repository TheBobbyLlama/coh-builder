var powersetAtlas

export const initializeDataset = (environment) => {
	powersetAtlas = require("../data/" + environment + "/PowerSets.json");
	return powersetAtlas; // Return the value so we can track changes if needed.
}

export const getArchetypeData = (environment) => {
	var result = require("../data/" + environment + "/I12.json");

	if (result) {
		return result.Archetypes.filter(curAt => curAt.Playable);
	} else {
		return [];
	}
};