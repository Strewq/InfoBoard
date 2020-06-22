import IGadget from "../types/IGadget";
import IRegularTask from "./../types/IRegularTask";
import * as PartialClassTask from "./PartialClassTask";
import EventEmitter from "eventemitter3";

export interface ISerializedRegularTask extends PartialClassTask.ISerializedTask {
	_type: "RegularTask",

	isCompleted: boolean
};

export interface IRegularTaskConstructorOptions extends PartialClassTask.ITaskConstructorOptions {
	isCompleted?: boolean
}

export default interface RegularTask extends PartialClassTask.PropDeclarations {}
export default class RegularTask extends EventEmitter implements IRegularTask, IGadget {
	readonly isCompleted: boolean = false;

	constructor(options: IRegularTaskConstructorOptions = {}) {
		super();

		PartialClassTask.assignPropsFromOptions.call(this, options);

		this.isCompleted = options.isCompleted ?? false;
	}

	complete() {
		if(this.isCompleted === true) {
			return;
		}

		(this.isCompleted as boolean) = true;
		
		this.emit("complete");
		this.emit("update");
	}

	uncomplete() {
		if(this.isCompleted === false) {
			return;
		}

		(this.isCompleted as boolean) = false;
		
		this.emit("uncomplete");
		this.emit("update");
	}

	toggle() {
		(this.isCompleted as boolean) = !this.isCompleted;

		if(this.isCompleted) {
			this.emit("complete");
		}
		else {
			this.emit("uncomplete");
		}
		this.emit("update");

		return this.isCompleted;
	}

	static fromJSON(plainObj: ISerializedRegularTask) {
		return new RegularTask(
			{
				...PartialClassTask.createOptionObjFromPlainObj(plainObj),
				
				isCompleted: plainObj.isCompleted,
			}
		);
	}

	toJSON(): ISerializedRegularTask {
		let res: ISerializedRegularTask = <ISerializedRegularTask>PartialClassTask.toJSON.call(this);

		res._type = "RegularTask";

		res.isCompleted = this.isCompleted;

		return res;
	}
}