import IMessage from "../types/IMessage";
import IGadget from "../types/IGadget";
import * as PartialClassGadget from "./PartialClassGadget";

export interface ISerializedMessage extends PartialClassGadget.ISerializedGadget {
	_type: "Message",

	message: string,
}

export interface IMessageConstructorOptions extends PartialClassGadget.IGadgetConstructorOptions {
	message?: string
}

export default interface Message extends PartialClassGadget.PropDeclarations {}
export default class Message implements IMessage, IGadget {
	readonly message: string;

	constructor(options: IMessageConstructorOptions = {}) {
		PartialClassGadget.assignPropsFromOptions.call(this, options);

		this.message = options.message ?? "";
	}

	static fromJSON(plainObj: ISerializedMessage) {
		return new Message(
			{
				...PartialClassGadget.createOptionObjFromPlainObj(plainObj),

				message: plainObj.message
			}
		);
	}

	toJSON(): ISerializedMessage {
		let res: ISerializedMessage = <ISerializedMessage>PartialClassGadget.toJSON.call(this);
		
		res._type = "Message";

		res.message = this.message;
		
		return res;
	}
}