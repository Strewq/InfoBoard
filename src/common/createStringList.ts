import StringList, {IStringListConstructorOptions} from "../classes/StringList";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createStringList(options: IStringListConstructorOptions) {
	let stringList: StringList;
	try {
		stringList = new StringList(options);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return stringList;
}