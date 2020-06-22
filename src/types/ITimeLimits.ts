import Stage from "./Stage";
import ITimeTerm from "./ITimeTerm";

export default interface ITimeLimits {
	readonly startTime: number | null;
	readonly endTime: number | null;

	readonly stage: Stage;

	readonly currentTargetTime: number | null;

	getTimeTermToCurrentTargetTime(): ITimeTerm | null

	getTimelengthToCurrentTargetTime(): number | null
}