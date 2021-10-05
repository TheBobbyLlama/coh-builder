import { useStoreContext } from "../../utils/GlobalState";

import PowerWidget from "../../components/PowerWidget/PowerWidget";

import "./CharacterPowerPanel.css";

function CharacterPowerPanel() {
	const [state,] = useStoreContext();

	return (
		<div id="powerPanel"  className="builderPanel">
			<div id="powerList">
				{state.miscData.PowerLevels.map((item, index) => {
					return (<PowerWidget
								key={"Level_" + item}
								label={Math.floor(item)}
								target={state.powers["Level_" + item]}
								allowChange={item !== 1.1}
							/>);
				})}
				{Object.entries(state.powers).filter(info => info[0].startsWith("Inherent_")).map(info => {
					return (<PowerWidget
								key={info[0]}
								target={info[1]}
								allowChange={false}
							/>);
				})}
				<PowerWidget
					target={state.powers["AT_" + state.archetype.DisplayName]}
					allowChange={false}
				/>
				{Object.entries(state.powers).filter(info => info[0].startsWith("Power_")).map(info => {
					return (<PowerWidget
								key={info[0]}
								target={info[1]}
								allowChange={false}
							/>)
				})}
				{state.miscData.Accolades.map((item, index) => {
					if (state.powers["Accolade_" + index]) {
						return (<PowerWidget
									key={"Accolade" + index}
									target={state.powers["Accolade_" + index]}
									allowChange={false}
								/>);
					} else {
						return null;
					}
				})}
				{Object.entries(state.miscData.Incarnates).map(info => {
					if (state.powers["Incarnate_" + info[0]]) {
						return (<PowerWidget
									key={"Incarnate" + info[0]}
									target={state.powers["Incarnate_" + info[0]]}
									allowChange={false}
								/>);
					} else {
						return null;
					}
				})
				}
			</div>
		</div>
	);
}

export default CharacterPowerPanel;