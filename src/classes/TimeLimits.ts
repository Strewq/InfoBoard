import BaseTimer from "./BaseTimer";
import ITimeLimits from "../types/ITimeLimits";
import ITypedSerializable from "./../types/ITypedSerializable";
import Stage from "../types/Stage";
import CreatingError from "./CreatingError";
import EventEmitter from "eventemitter3";
import ITimeSource from "../types/ITimeSource";
import {addTimeTermToTimepoint} from "../common/timeTermFuncs";
import ITimeTerm from "../types/ITimeTerm";

const msInMinute = 60000 as const;

export interface ISerializedTimeLimits {
	_type: "TimeLimits",

	startTime: number | null,
	endTime: number | null,
}

export interface ITimeLimitsConstructorOptions {
	startTime?: number | ITimeTerm | null,
	endTime?: number | ITimeTerm | null,
}

export default class TimeLimits extends EventEmitter implements ITimeLimits, ITypedSerializable {
	static timeSource: ITimeSource = Date;
	
	private _baseTimer: BaseTimer;

	readonly startTime: number | null;
	readonly endTime: number | null;

	readonly stage: Stage;
	readonly currentTargetTime: number | null;

	constructor(startTime: number | ITimeTerm | null, endTime: number | ITimeTerm | null) {
		if(typeof startTime !== "number" && startTime !== null) {
			startTime = addTimeTermToTimepoint(TimeLimits.timeSource.now(), startTime);
		}

		if(typeof endTime !== "number" && endTime !== null) {
			endTime = addTimeTermToTimepoint(TimeLimits.timeSource.now(), endTime);
		}

		if(startTime !== null) {
			startTime = startTime - (startTime % msInMinute);
		}
		if(endTime !== null) {
			endTime = endTime - (endTime % msInMinute);
		}
		
		if(startTime !== null && endTime !== null && startTime > endTime) {
			throw new CreatingError("EndTime must be greater than or equal to StartTime", new RangeError());
		}

		super();

		this.startTime = startTime;
		this.endTime = endTime;

		let targetTimes: number[] = [];

		if(startTime !== null) {
			targetTimes.push(startTime);
		}
		if(endTime !== null) {
			targetTimes.push(endTime);
		}

		this._baseTimer = new BaseTimer(targetTimes/* , 0 */);
		
		this._baseTimer.addListener("targetTimeCome", this._emitStageChangeEvent, this);

		let curTime = TimeLimits.timeSource.now();

		this.stage = this._calcStage(curTime);
		this.currentTargetTime = this._calcCurrentTargetTime(curTime);
	}

	private _calcStage(time: number) {
		if(this.startTime !== null && time < this.startTime) {
			return Stage.Before;
		}
		else if(this.endTime !== null && time > this.endTime) {
			return Stage.After;
		}
		else {
			return Stage.InProgress;
		}
	}

	private _calcCurrentTargetTime(time: number) {
		let stage = this._calcStage(time);
		
		if(stage === Stage.Before) {
			return this.startTime!;
		}
		else if(stage === Stage.InProgress && this.endTime !== null) {
			return this.endTime;
		}
		else {
			return null;
		}
	}

	private _emitStageChangeEvent() {
		(this.stage as Stage) = this.stage + 1;
		(this.currentTargetTime as number | null) = this._baseTimer.currentTargetTime;

		this.emit("stageChange");
		this.emit("update");
	}

	getTimeTermToCurrentTargetTime() {
		return this._baseTimer.getTimeTermToCurrentTargetTime();
	}

	getTimelengthToCurrentTargetTime() {
		return this._baseTimer.getTimelengthToCurrentTargetTime();
	}

	static fromJSON(plainObj: ISerializedTimeLimits) {
		return new TimeLimits(plainObj.startTime, plainObj.endTime);
	}

	toJSON(): ISerializedTimeLimits {
		return {
			_type: "TimeLimits",

			startTime: this.startTime,
			endTime: this.endTime
		};
	}
}