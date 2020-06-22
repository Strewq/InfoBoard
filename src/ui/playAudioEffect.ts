import ringing from "../audio/ringing.webm";

const audioEffectNameToFileMap = {
	"ringing": ringing
};

type audioEffectNames = keyof typeof audioEffectNameToFileMap;
type audioEffectNameToFileMapType = {
	[K in audioEffectNames]: string;
};

function createAudioElems(audioEffectNameToFileMap: audioEffectNameToFileMapType) {
	const audioElems: {
		[K in audioEffectNames]: HTMLAudioElement
	} = {} as any;
	
	for(let [audioEffectName, audioEffectFile] of Object.entries(audioEffectNameToFileMap) as [audioEffectNames, string][]) {
		audioElems[audioEffectName] = new Audio(audioEffectFile);
	}

	return audioElems;
}

const audioElems = createAudioElems(audioEffectNameToFileMap);

export default function playAudioEffect(audioEffectName: audioEffectNames) {
	let audioElem = audioElems[audioEffectName];

	audioElem.currentTime = 0;

	audioElem.play()
		.catch(() => {})
	;
}