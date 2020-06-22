import IGadget from "../types/IGadget";
import * as PartialClassGadget from "./PartialClassGadget";
import BaseTimer from "./BaseTimer";
import ITimeTerm from "../types/ITimeTerm";

export interface ISerializedTimer extends PartialClassGadget.ISerializedGadget {
	_type: "Timer",
	
	targetTimes: readonly number[],
	// lastConfirmedReceiptTimePeriodIndex: number
}

export interface ITimerConstructorOptions extends PartialClassGadget.IGadgetConstructorOptions {
	targetTimes?: readonly (number | ITimeTerm)[],
	// lastConfirmedReceiptTimePeriodIndex?: number
}

export default interface Timer extends PartialClassGadget.PropDeclarations {}
export default class Timer extends BaseTimer implements IGadget {
	constructor(options: ITimerConstructorOptions = {}) {
		super(options.targetTimes ?? []/* , options.lastConfirmedReceiptTimePeriodIndex ?? 0 */);
		
		PartialClassGadget.assignPropsFromOptions.call(this, options);
	}

	static fromJSON(plainObj: ISerializedTimer) {
		return new Timer(
			{
				...PartialClassGadget.createOptionObjFromPlainObj(plainObj),

				targetTimes: plainObj.targetTimes,
				// lastConfirmedReceiptTimePeriodIndex: plainObj.lastConfirmedReceiptTimePeriodIndex
			}
		);
	}

	toJSON(): ISerializedTimer {
		let res: ISerializedTimer = <ISerializedTimer>PartialClassGadget.toJSON.call(this);

		res._type = "Timer";

		res.targetTimes = this.targetTimes;
		// res.lastConfirmedReceiptTimePeriodIndex = this.lastConfirmedReceiptTimePeriodIndex;
		
		return res;
	}
}