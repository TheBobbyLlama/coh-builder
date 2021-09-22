export const initializeDataset = (environment) => {
	const archetypeData = require("../data/" + environment + "/Archetypes.json");
	const attribModData = require("../data/" + environment + "/AttribMods.json");
	const enhancementData = require("../data/" + environment + "/Enhancement.json");
	const enhancementClassData = require ("../data/" + environment + "/EnhancementClasses.json");
	const powersetData = require("../data/" + environment + "/PowerSets.json");

	return [archetypeData, attribModData, enhancementData, enhancementClassData, powersetData];
}