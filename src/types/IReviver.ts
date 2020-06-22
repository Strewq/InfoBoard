import {ITypedDeserializator} from "./ITypedSerializable";

export default interface IReviver {
	deserializators: Map<string, ITypedDeserializator>,
	revive(str: string): any
}