import IGadget from "../types/IGadget";
import * as PartialClassGadget from "./PartialClassGadget";
import IStopwatch from "../types/IStopwatch";
import ITimeSource from "../types/ITimeSource";
import ITimePeriod from "../types/ITimePeriod";
import EventEmitter from "eventemitter3";
import TimeTerm from "./TimeTerm";

export interface ISerializedStopwatch extends PartialClassGadget.ISerializedGadget {
	_type: "Stopwatch",
	
	timePeriods: readonly ITimePeriod[],
	curPeriodStartTime: number | null
}

export interface IStopwatchConstructorOptions extends PartialClassGadget.IGadgetConstructorOptions {
	timePeriods?: readonly ITimePeriod[],
	curPeriodStartTime?: number | null
}

export default interface Stopwatch extends PartialClassGadget.PropDeclarations {}
export default class Stopwatch extends EventEmitter implements IStopwatch, IGadget {
	static timeSource: ITimeSource = Date;

	readonly timePeriods: readonly ITimePeriod[];

	readonly curPeriodStartTime: number | null;

	private _timeLengthOfCompletedPeriods: number;

	get isStarted() {
		return this.curPeriodStartTime !== null;
	}

	constructor(options: IStopwatchConstructorOptions = {}) {
		super();
		
		PartialClassGadget.assignPropsFromOptions.call(this, options);

		this.timePeriods = [...(options.timePeriods ?? [])];
		this.curPeriodStartTime = options.curPeriodStartTime ?? null;

		this._timeLengthOfCompletedPeriods = this._getTimeLengthOfCompletedPeriods();
	}

	private _getTimeLengthOfCompletedPeriods() {
		return this.timePeriods.reduce<number>((prev, cur) => prev + cur.length, 0);
	}

	toggle() {
		if(this.isStarted) {
			let curTime = Stopwatch.timeSource.now();

			(this.timePeriods as ITimePeriod[]).push({
				start: this.curPeriodStartTime!,
				end: curTime,
				length: curTime - this.curPeriodStartTime!
			});

			(this.curPeriodStartTime as number | null) = null;

			this._timeLengthOfCompletedPeriods = this._getTimeLengthOfCompletedPeriods();

			this.emit("stop");
		}
		else {
			(this.curPeriodStartTime as number | null) = Stopwatch.timeSource.now();

			this.emit("start");
		}
		this.emit("update");
	}

	clear() {
		(this.timePeriods as ITimePeriod[]).length = 0;

		(this.curPeriodStartTime as number | null) = null;

		this._timeLengthOfCompletedPeriods = 0;

		this.emit("clear");
		this.emit("update");
	}

	getCurPeriodTimeTerm() {
		if(this.curPeriodStartTime === null) {
			return null;
		}

		return new TimeTerm(Stopwatch.timeSource.now(), this.curPeriodStartTime);
	}

	getCurPeriodTimelength() {
		if(this.curPeriodStartTime === null) {
			return null;
		}

		return Stopwatch.timeSource.now() - this.curPeriodStartTime;
	}

	getTotalTimelength() {
		if(this.timePeriods.length === 0 && !this.isStarted) {
			return null;
		}
		
		return this._timeLengthOfCompletedPeriods + (this.getCurPeriodTimelength() ?? 0);
	}

	getTotalTimeTerm() {
		let totalTimelength = this.getTotalTimelength();
		let curTime = Stopwatch.timeSource.now();

		if(totalTimelength === null) {
			return null;
		}

		let mockStartTime = curTime - totalTimelength;

		return new TimeTerm(curTime, mockStartTime);
	}

	static fromJSON(plainObj: ISerializedStopwatch) {
		return new Stopwatch(
			{
				...PartialClassGadget.createOptionObjFromPlainObj(plainObj),

				timePeriods: plainObj.timePeriods,
				curPeriodStartTime: plainObj.curPeriodStartTime
			}
		);
	}

	toJSON(): ISerializedStopwatch {
		let res: ISerializedStopwatch = <ISerializedStopwatch>PartialClassGadget.toJSON.call(this);

		res._type = "Stopwatch";

		res.timePeriods = this.timePeriods;
		res.curPeriodStartTime = this.curPeriodStartTime;
		
		return res;
	}
}