import pako from "pako";

// https://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin

// Convert a hex string to a byte array
const hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
};

// Convert a byte array to a hex string
const bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
};

export const getDataChunk = (input) => {
	// MIDS REBORN EXPORT URL
	// URL params: uc - Size Uncompressed, c - Size Compressed, a - Size Encoded, dc - Encoded Data
	let testMe = input.match(/(?:.*\?.*.*a=(.+?)&.+dc=)(.*)$/);

	if (testMe?.length === 3) {
		// Validate length
		if (testMe[2].length === Number(testMe[1])) {
			return testMe[2];
		} else {
			return false;
		}
	}

	// MIDS DATA CHUNK
	testMe = input.match(/(?:\|-+\|\n\|MxD.+;(\d+);HEX;\|\n)((?:\|\w+\|\n)+)(?:\|-+\|)/);

	if (testMe?.length === 3) {
		testMe[2] = testMe[2].replace(/\||\n/g, "");
		// Validate length
		if (testMe[2].length === Number(testMe[1])) {
			return testMe[2];
		} else {
			return false;
		}
	}

	// COH BUILDER LINK
	testMe = input.match(/(?:.*\/load\?data=)(.*)$/);

	if (testMe?.length === 2) {
		return testMe[1];
	}

	return false;
}

export const importCharacter = (dataStream, state) => {
	try {
		const data = pako.inflate(hexToBytes(dataStream));
		console.log(data, data.length);
		navigator.clipboard.writeText(data.toString());
	} catch (e) {
		console.log("Error decompressing build data: " + e);
	}

	return false;
}