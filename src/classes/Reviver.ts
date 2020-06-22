import {ITypedDeserializator} from "./../types/ITypedSerializable";
import IReviver from "./../types/IReviver";

export default class Reviver implements IReviver {
	deserializators = new Map<string, ITypedDeserializator>();

	_reviveFunc = (key: string, value: any) => {
		if(value && typeof value._type === "string") {
			let deserializator = this.deserializators.get(value._type);

			if(deserializator !== undefined) {
				return deserializator(value);
			}
		}
		return value;
	};

	revive(str: string) {
		return JSON.parse(str, this._reviveFunc);
	}
}