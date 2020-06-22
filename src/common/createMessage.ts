import Message, {IMessageConstructorOptions} from "../classes/Message";
import CreatingError from "../classes/CreatingError";
import UniquenessError from "../classes/UniquenessError";

export default function createMessage(options: IMessageConstructorOptions) {
	let message: Message;
	try {
		message = new Message(options);
	}
	catch(err) {
		if(err instanceof CreatingError && err.cause instanceof UniquenessError) {
			return false;
		}
		throw err;
	}

	return message;
}