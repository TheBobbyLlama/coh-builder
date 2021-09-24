export const initializeDataset = (environment) => {
	const archetypeData = require("../data/" + environment + "/Archetypes.json");
	const attribModData = require("../data/" + environment + "/AttribMods.json");
	const enhancementData = require("../data/" + environment + "/Enhancement.json");
	const enhancementClassData = require("../data/" + environment + "/EnhancementClasses.json");
	const enhancementSetData = require("../data/" + environment + "/EnhancementSets.json");
	const powersetData = require("../data/" + environment + "/PowerSets.json");
	const miscData = require("../data/" + environment + "/MiscData.json");

	return [archetypeData, attribModData, enhancementData, enhancementClassData, enhancementSetData, powersetData, miscData];
}