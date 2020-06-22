import consoleDivCss from "./consoleDiv.scss";

let writeTextLineOnPage = Object.assign(function(text: string) {
	let doScroll = writeTextLineOnPage.consoleDiv.scrollTop === writeTextLineOnPage.consoleDiv.scrollHeight - writeTextLineOnPage.consoleDiv.offsetHeight;

	writeTextLineOnPage.consoleDiv.innerHTML += `${writeTextLineOnPage.curLineIndex++} ${text}<br>`;

	if(doScroll) {
		writeTextLineOnPage.consoleDiv.scrollTop = writeTextLineOnPage.consoleDiv.scrollHeight;
	}
}, {
	curLineIndex: 0,
	consoleDiv: (() => {
		let consoleDiv = document.createElement("div");
		consoleDiv.className = consoleDivCss.consoleDiv;
	
		document.body.append(consoleDiv);

		return consoleDiv;
	})()
});

export default writeTextLineOnPage;