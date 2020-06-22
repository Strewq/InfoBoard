import IUDate from "../types/IUDate";
import UDate from "../classes/UDate";
import TimePartSetMode from "../types/TimePartSetMode";
import TimePartNameType from "../types/TimePartNameType";

export function addToPart(addend: number, date: IUDate, partName: TimePartNameType, utc: boolean, mode: TimePartSetMode) {
	let newDate = new UDate(date.getNum());
	newDate.setPart(newDate.getPart(partName, utc) + addend, partName, utc, mode);
	return newDate.getPart(partName, utc);
}