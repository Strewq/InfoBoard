import CounterTask, {ICounterTaskConstructorOptions} from "../classes/CounterTask";
import TimeLimits from "../classes/TimeLimits";
import ITimeTerm from "../types/ITimeTerm";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createCounterTask(startTime: number | ITimeTerm | null, endTime: number | ITimeTerm | null, options: ICounterTaskConstructorOptions) {
	let timeLimits: TimeLimits;
	try {
		timeLimits = new TimeLimits(startTime, endTime);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof RangeError) {
			return false;
		}
		throw err;
	}

	let newOptions = {...options, timeLimits: timeLimits};

	let counterTask: CounterTask;
	try {
		counterTask = new CounterTask(newOptions);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return counterTask;
}