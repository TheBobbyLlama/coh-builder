import "./Enhancement.css";

function Enhancement({ enhancement, useSets }) {
	const getImage = () => {
		if (enhancement?.Image) {
			return require("../../assets/images/" + ((useSets) ? "sets" : "enhancements") + "/" + enhancement.Image).default;
		} else {
			return undefined;
		}
	}

	const myImage = getImage();

	return (
		<div className="enhancement" title={enhancement?.LongName}>
			{(myImage) ? (<img src={myImage} alt={enhancement?.LongName} />) : <></>}
		</div>
	);
}

export default Enhancement;