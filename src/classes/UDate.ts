import IUDate from "../types/IUDate";
import TimePartNameType from "../types/TimePartNameType";
import {
	uDateCloseIntervals as closeIntervals,
	uDateLimitIntervals as limitIntervals,
	dayCloseIntervals,
	dayLimitIntervals,
	getNumOfDaysInMonth
} from "../common/timePart";
import TimePartSetMode from "../types/TimePartSetMode";
import {limitNum, closeNum} from "@strewq/intervalLib";

const datePartGetterMap = {
	y: "getFullYear",
	mo: "getMonth",
	d: "getDate",
	h: "getHours",
	m: "getMinutes",
	s: "getSeconds",
	ms: "getMilliseconds"
};
const dateUtcPartGetterMap = {
	y: "getUTCFullYear",
	mo: "getUTCMonth",
	d: "getUTCDate",
	h: "getUTCHours",
	m: "getUTCMinutes",
	s: "getUTCSeconds",
	ms: "getUTCMilliseconds"
};
const datePartGetterMapMap = new Map([
	[false, datePartGetterMap],
	[true, dateUtcPartGetterMap]
]);

const datePartSetterMap = {
	y: "setFullYear",
	mo: "setMonth",
	d: "setDate",
	h: "setHours",
	m: "setMinutes",
	s: "setSeconds",
	ms: "setMilliseconds"
};
const dateUtcPartSetterMap = {
	y: "setUTCFullYear",
	mo: "setUTCMonth",
	d: "setUTCDate",
	h: "setUTCHours",
	m: "setUTCMinutes",
	s: "setUTCSeconds",
	ms: "setUTCMilliseconds"
};
const datePartSetterMapMap = new Map([
	[false, datePartSetterMap],
	[true, dateUtcPartSetterMap]
]);

export default class UDate implements IUDate {
	private _date: Date;

	constructor()
	constructor(num: number)
	constructor(str: string)
	constructor(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number)
	constructor(...args: any[]) {
		this._date = new (Date as any)(...args);
	}

	getNum() {
		return this._date.getTime();
	}

	setNum(newValue: number) {
		this._date.setTime(newValue);
	}

	getPart(partName: TimePartNameType, utc: boolean): number {
		return (this._date as any)[datePartGetterMapMap.get(utc)![partName]]();
	}

	setPart(value: number, partName: TimePartNameType, utc: boolean, mode: TimePartSetMode = TimePartSetMode.Transfer) {
		if(mode === TimePartSetMode.Transfer) {
			(this._date as any)[datePartSetterMapMap.get(utc)![partName]](value);
		}
		else if(mode === TimePartSetMode.Limit) {
			if(partName === "d") {
				let y = this.getPart("y", utc);
				let mo = this.getPart("mo", utc);
				let interval = dayLimitIntervals[getNumOfDaysInMonth(y, mo)!];

				let limitedValue = limitNum(value, interval);
				
				(this._date as any)[datePartSetterMapMap.get(utc)![partName]](limitedValue);
			}
			else {
				let limitedValue = limitNum(value, limitIntervals[partName]);
				
				(this._date as any)[datePartSetterMapMap.get(utc)![partName]](limitedValue);
			}
		}
		else if(mode === TimePartSetMode.Close) {
			if(partName === "d") {
				let y = this.getPart("y", utc);
				let mo = this.getPart("mo", utc);
				let interval = dayCloseIntervals[getNumOfDaysInMonth(y, mo)!];

				let closedValue = closeNum(value - 1, interval)! + 1;
				
				(this._date as any)[datePartSetterMapMap.get(utc)![partName]](closedValue);
			}
			else {
				let closedValue = closeNum(value, closeIntervals[partName]);
				
				(this._date as any)[datePartSetterMapMap.get(utc)![partName]](closedValue);
			}
		}
	}
}