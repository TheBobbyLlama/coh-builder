import { useStoreContext } from "../../utils/GlobalState";

import PowerWidget from "../../components/PowerWidget/PowerWidget";

import "./CharacterPowerPanel.css";

function CharacterPowerPanel() {
	const [state,] = useStoreContext();

	const powerLevels = [ 1, 1.1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35, 38, 41, 44, 47, 49 ];

	return (
		<div id="powerPanel"  className="builderPanel">
			<div id="powerList">
				{powerLevels.map((item, index) => {
					return (<PowerWidget
								key={"Power" + index}
								label={Math.floor(item)}
								target={state.powers[item]}
								allowChange={item !== 1.1}
							/>);
				})}
			</div>
		</div>
	);
}

export default CharacterPowerPanel;