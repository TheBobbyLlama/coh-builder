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
						var curName = curItem.DisplayName || curItem;
						var selected = ((curItem === selectedItem) || (curItem.DisplayName === selectedItem)) ? "selected" : "";
						return <div className={selected} key={curName} onClick={() => { changeFunc(curItem.DisplayName || curItem); }}><img src={iconFunc(curItem.DisplayName || curItem).default} alt="" /> {curItem.DisplayName || curItem}</div>
					})}
				</div>
				<div className="modalBack" />
			</> : <></>}
		</div>
	);
}

export default IconDropdown;