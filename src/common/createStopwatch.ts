import Stopwatch, {IStopwatchConstructorOptions} from "../classes/Stopwatch";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createStopwatch(options: IStopwatchConstructorOptions) {
	let stopwatch: Stopwatch;
	try {
		stopwatch = new Stopwatch(options);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return stopwatch;
}