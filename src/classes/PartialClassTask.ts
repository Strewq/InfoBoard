import IGadget from "../types/IGadget";
import ITask from "../types/ITask";
import * as PartialClassGadget from "./PartialClassGadget";
import ITimeLimits from "../types/ITimeLimits";
import ITypedSerializable from "../types/ITypedSerializable";
import EventEmitter from "eventemitter3";
import TimeLimits from "./TimeLimits";

type TypedSerializableITimeLimits = (ITimeLimits & EventEmitter & ITypedSerializable);

export interface ISerializedTask extends PartialClassGadget.ISerializedGadget {
	timeLimits: TypedSerializableITimeLimits
}

export interface ITaskConstructorOptions extends PartialClassGadget.IGadgetConstructorOptions {
	timeLimits?: TypedSerializableITimeLimits
}

export function assignPropsFromOptions(this: IGadget & ITask, options: ITaskConstructorOptions) {
	PartialClassGadget.assignPropsFromOptions.call(this, options);

	(this.timeLimits as TypedSerializableITimeLimits) = options.timeLimits ?? new TimeLimits(null, null);
}

export function toJSON(this: IGadget & ITask & {timeLimits: TypedSerializableITimeLimits}) {
	let res: ISerializedTask = <ISerializedTask>PartialClassGadget.toJSON.call(this);

	res.timeLimits = this.timeLimits;
	
	return res;
}

export function createOptionObjFromPlainObj(plainObj: ISerializedTask): ITaskConstructorOptions {
	return {
		...PartialClassGadget.createOptionObjFromPlainObj(plainObj),

		timeLimits: plainObj.timeLimits
	};
}

export interface PropDeclarations extends PartialClassGadget.PropDeclarations {
	readonly timeLimits: TypedSerializableITimeLimits
}