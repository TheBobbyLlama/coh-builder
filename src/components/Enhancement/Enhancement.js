import "./Enhancement.css";

function Enhancement({ enhancement, pathOverride }) {
	const getImage = () => {
		if (enhancement?.Image) {
			return require("../../assets/images/" + (pathOverride || "enhancements") + "/" + enhancement.Image).default;
		} else {
			return undefined;
		}
	}

	const myImage = getImage();

	const getBackground = () => {
		switch (enhancement?.TypeID) {
			case -1:
				return " blank";
			case 2:
			case 4:
				return " IO";
			case 3:
				return " HO";
			default:
				return "";
		}
	}

	return (
		<div className={"enhancement" + getBackground()} title={enhancement?.LongName || enhancement?.Name}>
			{(myImage) ? (<img src={myImage} alt={enhancement?.Name || enhancement?.LongName} />) : <></>}
			{(enhancement?.SpecialText) ? <div className="specialText">{enhancement.SpecialText}</div> : <></>}
		</div>
	);
}

export default Enhancement;