export const initializeDataset = (environment) => {
	const powersetAtlas = require("../data/" + environment + "/PowerSets.json");
	const poolAtlas = require("../data/" + environment + "/PowerPools.json");
	const poolData = [];

	for (var i = 0; i < poolAtlas.length; i++) {
		if (poolAtlas[i].GroupName) {
			let powerPool = {};

			if (poolAtlas[i].FileName?.startsWith("/")) {
				powerPool = require("../data/" + environment + "/db" + poolAtlas[i].FileName + ".json");
			} else {
				var setName = poolAtlas[i].FileName || poolAtlas[i].DisplayName.replaceAll(" ", "_");
				powerPool = require("../data/" + environment + "/db/Other/_" + poolAtlas[i].GroupName + "." + setName + ".json");
			}

			poolData.push(powerPool);
		}
	}

	return [powersetAtlas, poolData];
}

export const getArchetypeData = (environment) => {
	var result = require("../data/" + environment + "/I12.json");

	if (result) {
		return result.Archetypes.filter(curAt => curAt.Playable);
	} else {
		return [];
	}
};