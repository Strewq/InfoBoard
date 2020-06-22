import ITimeLimits from "./ITimeLimits";
import EventEmitter from "eventemitter3";

export default interface ITask {
	readonly timeLimits: (ITimeLimits & EventEmitter);

	readonly isCompleted: boolean
}