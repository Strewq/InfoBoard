export default interface ITypedSerializable {
	toJSON(): {_type: string};
}

export interface ITypedDeserializator {
	(plainObj: {_type: string}): any;
}