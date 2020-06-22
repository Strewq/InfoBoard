import ITimePeriod from "./ITimePeriod";
import ITimeTerm from "./ITimeTerm";

export default interface IStopwatch {
	readonly timePeriods: readonly ITimePeriod[];

	readonly curPeriodStartTime: number | null;
	
	readonly isStarted: boolean;
	
	toggle(): void;
	clear(): void;

	getCurPeriodTimelength(): number | null;
	getCurPeriodTimeTerm(): ITimeTerm | null;

	getTotalTimelength(): number | null;
	getTotalTimeTerm(): ITimeTerm | null;
}