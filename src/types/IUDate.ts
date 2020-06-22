import TimePartNameType from "./TimePartNameType";
import TimePartSetMode from "./TimePartSetMode";

export default interface IUDate {
	getNum(): number
	setNum(value: number): void
	getPart(partName: TimePartNameType, utc: boolean): number
	setPart(value: number, partName: TimePartNameType, utc: boolean, mode: TimePartSetMode): void
}