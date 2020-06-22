import TimePartNameType from "./TimePartNameType";
import TimePartSetMode from "./TimePartSetMode";

export default interface ITimeTerm {
	getSign(): 1 | -1
	setSign(value: 1 | -1): void
	getPart(partName: TimePartNameType): number
	setPart(value: number, partName: TimePartNameType, mode: TimePartSetMode): void
}