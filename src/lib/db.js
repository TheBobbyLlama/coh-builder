export const initializeDataset = (environment) => {
/*	const powersetAtlas = require("../data/" + environment + "/PowerSets.json");
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

	return [powersetAtlas, poolData];*/
	const archetypeData = require("../data/" + environment + "/Archetypes.json").filter(item => item.Playable);
	const attribModData = require("../data/" + environment + "/AttribMods.json");
	const enhancementData = require("../data/" + environment + "/Enhancement.json");
	const enhancementClassData = require ("../data/" + environment + "/EnhancementClasses.json");
	const powersetData = require("../data/" + environment + "/PowerSets.json");

	return [archetypeData, attribModData, enhancementData, enhancementClassData, powersetData];
}
/*
export const getArchetypeData = (environment) => {
	var result = require("../data/" + environment + "/I12.json");

	if (result) {
		return result.Archetypes.filter(curAt => curAt.Playable);
	} else {
		return [];
	}
};*/