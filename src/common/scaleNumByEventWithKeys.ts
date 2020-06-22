type EventWithKeys = {
	ctrlKey: boolean,
	shiftKey: boolean,
	altKey: boolean,
};

export default function scaleNumByEventWithKeys(num: number, e: EventWithKeys) {
	if(e.ctrlKey) {
		return num * 100;
	}
	else if(e.shiftKey) {
		return num * 10;
	}
	else if(e.altKey) {
		return num * 0.1;
	}
	else {
		return num;
	}
}