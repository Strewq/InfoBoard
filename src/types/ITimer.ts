import ITimeTerm from "./ITimeTerm";

export default interface ITimer {
	readonly targetTimes: number[];
	readonly currentTargetTime: number | null;

	readonly currentTimePeriodIndex: number;
	// readonly lastConfirmedReceiptTimePeriodIndex: number;

	// readonly isReceiptConfirmed: boolean;

	getTimeTermToCurrentTargetTime(): ITimeTerm | null

	getTimelengthToCurrentTargetTime(): number | null

	// confirmReceipt(): void;
}