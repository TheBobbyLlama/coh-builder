import React, { useState } from "react";

import "./IconDropdown.css";

function IconDropdown({ itemList, iconFunc, selectedItem, changeFunc}) {
	const [openState, setOpenState] = useState(false);

	const toggleOpenState = () => {
		setOpenState(!openState);
	}

	return (
		<div className="iconDropdown" onClick={toggleOpenState}>
			<div><img src={iconFunc(selectedItem).default} alt="" /> {selectedItem}</div>
			{(openState) ? <>
				<div className="dropdownList">
					{itemList.map(curItem => {
						var selected = (curItem === selectedItem) ? "selected" : "";
						return <div className={selected} key={curItem} onClick={() => { changeFunc(curItem); }}><img src={iconFunc(curItem).default} alt="" /> {curItem}</div>
					})}
				</div>
				<div className="modalBack" />
			</> : <></>}
		</div>
	);
}

export default IconDropdown;