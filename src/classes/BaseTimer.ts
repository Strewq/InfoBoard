import ITimer from "../types/ITimer";
import ITimeSource from "../types/ITimeSource";
import EventEmitter from "eventemitter3";
import TimeTerm from "./TimeTerm";
import setTimer from "../common/setTimer";
import ITimeTerm from "../types/ITimeTerm";
import {addTimeTermToTimepoint} from "../common/timeTermFuncs";

export default class BaseTimer extends EventEmitter implements ITimer {
	static timeSource: ITimeSource = Date;
	
	readonly targetTimes: number[];
	readonly currentTargetTime: number | null;

	readonly currentTimePeriodIndex: number;
	// readonly lastConfirmedReceiptTimePeriodIndex: number;

	constructor(targetTimes: readonly (number | ITimeTerm)[]/* , lastConfirmedReceiptTimePeriodIndex: number */) {
		super();

		let curTime = BaseTimer.timeSource.now();
		
		let normalizedTargetTimes = targetTimes.map((value) => {
			if(typeof value !== "number") {
				return addTimeTermToTimepoint(curTime, value);
			}
			else {
				return value;
			}
		});

		this.targetTimes = [...normalizedTargetTimes].sort((a, b) => a - b);

		this.currentTargetTime = this._calcCurrentTargetTime(curTime);
		this.currentTimePeriodIndex = this._calcCurrentTimePeriodIndex(curTime);
		// this.lastConfirmedReceiptTimePeriodIndex = lastConfirmedReceiptTimePeriodIndex;

		for(let i = 0; i < this.targetTimes.length; ++i) {
			if(curTime < this.targetTimes[i]) {
				let newCurrentTargetTime = i + 1 !== this.targetTimes.length ? this.targetTimes[i + 1] : null;

				setTimer(this.targetTimes[i] - curTime, this._emitTargetTimeComeEvent, this, i + 1, newCurrentTargetTime);
			}
		}
	}

	// get isReceiptConfirmed() {
	// 	return this.lastConfirmedReceiptTimePeriodIndex >= this.currentTimePeriodIndex;
	// }

	private _calcCurrentTimePeriodIndex(time: number) {
		if(this.targetTimes.length === 0) {
			return 0;
		}
		
		for(let i = 0; i < this.targetTimes.length; ++i) {
			if(time < this.targetTimes[i]) {
				return i;
			}
		}
		// else
		return this.targetTimes.length;
	}

	private _calcCurrentTargetTime(time: number) {
		if(this.targetTimes.length === 0) {
			return null
		}

		for(let i = 0; i < this.targetTimes.length; ++i) {
			if(time < this.targetTimes[i]) {
				return this.targetTimes[i];
			}
		}

		return null;
	}

	private _emitTargetTimeComeEvent(newCurrentTimePeriodIndex: number, newCurrentTargetTime: number | null) {
		(this.currentTimePeriodIndex as number) = newCurrentTimePeriodIndex;
		(this.currentTargetTime as number | null) = newCurrentTargetTime;

		this.emit("targetTimeCome");
		this.emit("update");
	}

	getTimeTermToCurrentTargetTime() {
		if(this.currentTargetTime === null) {
			return null;
		}
		
		return new TimeTerm(this.currentTargetTime, BaseTimer.timeSource.now());
	}

	getTimelengthToCurrentTargetTime() {
		if(this.currentTargetTime === null) {
			return null;
		}
		
		return this.currentTargetTime - BaseTimer.timeSource.now();
	}

	// confirmReceipt() {
	// 	let oldValue = this.lastConfirmedReceiptTimePeriodIndex;

	// 	(this.lastConfirmedReceiptTimePeriodIndex as number) = this.currentTimePeriodIndex;

	// 	if(oldValue !== this.lastConfirmedReceiptTimePeriodIndex) {
	// 		this.emit("receiptIsConfirmed");
	// 		this.emit("update");
	// 	}
	// }
}