import Enhancement from "../Enhancement/Enhancement";

import "./SlotWidget.css";

function SlotWidget({ target }) {
	return (
		<div className="slotWidget">
			{target.slots.map((item, index) => {
				return (<div key={index}><Enhancement enhancement={item} /></div>);
			})}
		</div>
	);
}

export default SlotWidget;