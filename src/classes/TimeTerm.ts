import ITimeTerm from "../types/ITimeTerm";
import TimePartNameType from "../types/TimePartNameType"
import TimePartSetMode from "../types/TimePartSetMode";
import {
	timePartNameArr,
	transferNumOf,
	timeTermCloseIntervals as closeIntervals,
	timeTermLimitIntervals as limitIntervals,
	getNumOfDaysInMonth
} from "../common/timePart";
import {limitNum, closeNum} from "@strewq/intervalLib";
import UDate from "./UDate";

type TimeTermParts = {
	// all numbers must be positive
	ms: number,
	s: number,
	m: number,
	h: number,
	d: number,
	mo: number,
	y: number,
	sign: 1 | -1
};

export default class TimeTerm implements ITimeTerm {
	private static _createTimeTermPartsFromTimeTerm(timeTerm: ITimeTerm) {
		let newParts: TimeTermParts = ({} as any);

		newParts.sign = timeTerm.getSign();
		for(let partName of timePartNameArr) {
			newParts[partName] = timeTerm.getPart(partName);
		}

		return newParts;
	}

	private static _createZeroTimeTermParts() {
		let newParts: TimeTermParts = ({} as any);

		newParts.sign = 1;
		for(let partName of timePartNameArr) {
			newParts[partName] = 0;
		}

		return newParts;
	}

	private static _createTimeTermPartsByTimeDiff(timepointA: number, timepointB: number) {
		let dateA = new UDate(timepointA);
		let dateB = new UDate(timepointB);
		
		let newParts: TimeTermParts = ({} as any);

		if(timepointA >= timepointB) {
			newParts.sign = 1;
		}
		else {
			newParts.sign = -1;
			[dateB, dateA] = [dateA, dateB];
		}

		let transfer = 0;
		for(let i = timePartNameArr.length - 1; i >= 0; --i) {
			let partName = timePartNameArr[i];

			let a = dateA.getPart(partName, true);
			let b = dateB.getPart(partName, true);

			let res = a - b + transfer;
			if(res < 0) {
				transfer = -1;

				if(partName === "d") {
					let curY = dateA.getPart("y", true);
					let curMo = dateA.getPart("mo", true);

					let date = new UDate(curY, curMo);
					date.setPart(curMo - 1, "mo", true, TimePartSetMode.Transfer);

					let prevMo = date.getPart("mo", true);

					res = res + getNumOfDaysInMonth(curY, prevMo)!;
				}
				else if(partName === "y") {
				}
				else {
					res = res + transferNumOf[partName];
				}
			}
			else {
				transfer = 0;
			}

			newParts[partName] = res;
		}

		return newParts;
	}

	private static _createTimeTermPartsByNull() {
		let newParts: TimeTermParts = ({} as any);

		newParts.sign = 1;
		for(let partName of timePartNameArr) {
			newParts[partName] = NaN;
		}

		return newParts;
	}
	
	private _parts: TimeTermParts;

	constructor()
	constructor(nullValue: null)
	constructor(timeTerm: ITimeTerm)
	constructor(timepointA: number, timepointB: number)
	constructor(timeTermOrTimepointAOrNull?: ITimeTerm | number | null, timepointB?: number) {
		if(typeof timeTermOrTimepointAOrNull === "number") {
			this._parts = TimeTerm._createTimeTermPartsByTimeDiff(timeTermOrTimepointAOrNull, timepointB!);
		}
		else if(timeTermOrTimepointAOrNull === null) {
			this._parts = TimeTerm._createTimeTermPartsByNull();
		}
		else if(timeTermOrTimepointAOrNull === undefined) {
			this._parts = TimeTerm._createZeroTimeTermParts();
		}
		else {
			this._parts = TimeTerm._createTimeTermPartsFromTimeTerm(timeTermOrTimepointAOrNull);
		}
	}

	getSign() {
		return this._parts.sign;
	}

	setSign(value: 1 | -1) {
		this._parts.sign = value;
	}

	getPart(partName: TimePartNameType) {
		return this._parts[partName];
	}

	setPart(value: number, partName: TimePartNameType, mode: TimePartSetMode = TimePartSetMode.Transfer) {
		if(mode === TimePartSetMode.Transfer) {
			let assignedValue = value;
			
			for(let i = timePartNameArr.indexOf(partName); i >= 0; --i) {
				let curPartName = timePartNameArr[i];

				if(curPartName === "y") {
					if(Math.sign(assignedValue) === -1) {
						this._parts.sign = this._parts.sign === 1 ? -1 : 1;

						assignedValue += 1;
					}

					this._parts.y = Math.abs(assignedValue);
				}
				else {
					let transferNumOfThisPart = transferNumOf[curPartName];

					let newValue = assignedValue % transferNumOfThisPart;
					let transfer = Math.trunc(assignedValue / transferNumOfThisPart);

					if(Math.sign(newValue) === -1) {
						newValue = transferNumOfThisPart + newValue;

						// this statement must be executed if (newValue !== 0), but the condition is always true so there is no ifStatement
						transfer += -1;
					}

					this._parts[curPartName] = newValue;

					assignedValue = this._parts[timePartNameArr[i - 1]] + transfer;
				}
			}
		}
		else if(mode === TimePartSetMode.Limit) {
			this._parts[partName] = limitNum(value, limitIntervals[partName]);
		}
		else if(mode === TimePartSetMode.Close) {
			if(partName === "y") {
				this._parts[partName] = Math.abs(value);
				
				return;
			}
			
			this._parts[partName] = closeNum(value, closeIntervals[partName])!;
		}
	}
}