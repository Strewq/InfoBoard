import Timer, {ITimerConstructorOptions} from "../classes/Timer";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createTimer(options: ITimerConstructorOptions) {
	let timer: Timer;
	try {
		timer = new Timer(options);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return timer;
}