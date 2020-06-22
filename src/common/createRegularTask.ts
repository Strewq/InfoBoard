import RegularTask, {IRegularTaskConstructorOptions} from "../classes/RegularTask";
import ITimeTerm from "../types/ITimeTerm";
import TimeLimits from "../classes/TimeLimits";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createRegularTask(startTime: number | ITimeTerm | null, endTime: number | ITimeTerm | null, options: IRegularTaskConstructorOptions) {
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

	let regulartask: RegularTask;
	try {
		regulartask = new RegularTask(newOptions);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return regulartask;
}