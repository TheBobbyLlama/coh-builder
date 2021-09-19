import React, { useState } from "react";

import "./IconDropdown.css";

function IconDropdown({ itemList, iconFunc, selectedItem, changeFunc, disabled}) {
	const [openState, setOpenState] = useState(false);

	const toggleOpenState = () => {
		if (!disabled) {
			setOpenState(!openState);
		}
	}

	return (
		<div className={"iconDropdown" + ((disabled) ? " disabled" : "")} onClick={toggleOpenState}>
			<div><img src={iconFunc(selectedItem).default} alt="" /> {selectedItem}</div>
			{((!disabled) && (openState)) ? <>
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