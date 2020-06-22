import ITimeTerm from "../types/ITimeTerm";
import TimePartNameType from "../types/TimePartNameType";
import {timePartNameArr} from "./timePart";
import UDate from "../classes/UDate";
import TimePartSetMode from "../types/TimePartSetMode";
import TimeTerm from "../classes/TimeTerm";

function getGreatestTimeTermPartName(timeTerm: ITimeTerm): TimePartNameType {
	let res: TimePartNameType | null = null;
	
	for(let partName of timePartNameArr) {
		if(timeTerm.getPart(partName) > 0) {
			res = partName;

			break;
		}
	}

	if(res === null) {
		res = "ms";
	}

	return res;
}

export function addToPart(addend: number, timeTerm: ITimeTerm, partName: TimePartNameType, mode: TimePartSetMode) {
	let newTimeTerm = new TimeTerm(timeTerm);
	newTimeTerm.setPart(newTimeTerm.getPart(partName) + addend, partName, mode);
	return newTimeTerm.getPart(partName);
}

export function addTimeTermToTimepoint(timepoint: number, timeTerm: ITimeTerm): number {
	let date = new UDate(timepoint);
	let s = timeTerm.getSign();

	for(let i = timePartNameArr.length - 1; i >= 0; --i) {
		let partName = timePartNameArr[i];
		
		date.setPart(date.getPart(partName, true) + s * timeTerm.getPart(partName), partName, true, TimePartSetMode.Transfer);
	}

	return date.getNum();
}

export function getTimelengthWithoutGreatestPart(timepointA: number, timepointB: number) {
	let timeTerm = new TimeTerm(timepointA, timepointB);

	let greatestPartName = getGreatestTimeTermPartName(timeTerm);

	timeTerm.setPart(0, greatestPartName, TimePartSetMode.Limit);

	return addTimeTermToTimepoint(timepointA, timeTerm) - timepointA;
}

const timeUnitFullNamesPlural = {
	y: "years",
	mo: "months",
	d: "days",
	h: "hours",
	m: "minutes",
	s: "seconds",
	ms: "milliseconds"
} as const;

export function getLongTimeTermStr(timeTerm: ITimeTerm, format: number = 0b1111111) {
	let parts: string[] = [];

	for(let i = 0; i < timePartNameArr.length; ++i) {
		let ri = timePartNameArr.length - 1 - i;

		if(format & (1 << ri)) {
			parts.push(`${timeTerm.getPart(timePartNameArr[i])} ${timeUnitFullNamesPlural[timePartNameArr[i]]}`);
		}
	}

	return (timeTerm.getSign() === -1 ? "-" : "") + parts.join(" ");
}

export function getShortTimeTermStr(timeTerm: ITimeTerm, format: number = 0b1111111, delimiters: string[], paddings: number[]) {
	let parts: string[] = [];

	for(let i = 0; i < timePartNameArr.length; ++i) {
		let ri = timePartNameArr.length - 1 - i;

		if(format & (1 << ri)) {
			parts.push(String(timeTerm.getPart(timePartNameArr[i])).padStart(paddings[i] ?? 0, "0"));
		}
	}

	let joined = "";

	for(let i = 0; i < parts.length - 1; ++i) {
		joined += `${parts[i]}${delimiters[i] ?? ""}`;
	}
	joined += parts[parts.length - 1] ?? "";

	return (timeTerm.getSign() === -1 ? "-" : "") + joined;
}

export function getTimeTermGreatestPartStr(timeTerm: ITimeTerm) {
	let greatestPartName = getGreatestTimeTermPartName(timeTerm);

	return `${timeTerm.getSign() === -1 ? "-" : ""}${timeTerm.getPart(greatestPartName)} ${timeUnitFullNamesPlural[greatestPartName]}`;
}