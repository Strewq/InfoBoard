import IGadget from "../types/IGadget";
import ICounterTask from "./../types/ICounterTask";
import * as PartialClassTask from "./PartialClassTask";
import ComparisonOperator from "../types/ComparisonOperator";
import comparisonOperatorMap from "../common/comparisonOperatorMap";
import EventEmitter from "eventemitter3";

export interface ISerializedCounterTask extends PartialClassTask.ISerializedTask {
	_type: "CounterTask",

	expected: number,
	actual: number,
	comparisonOperator: ComparisonOperator,
}

export interface ICounterTaskConstructorOptions extends PartialClassTask.ITaskConstructorOptions {
	expected?: number,
	actual?: number,
	comparisonOperator?: ComparisonOperator,
}

export default interface CounterTask extends PartialClassTask.PropDeclarations {}
export default class CounterTask extends EventEmitter implements ICounterTask, IGadget {
	readonly expected: number;
	readonly actual: number;
	readonly comparisonOperator: ComparisonOperator;

	constructor(options: ICounterTaskConstructorOptions = {}) {
		super();

		PartialClassTask.assignPropsFromOptions.call(this, options);

		this.expected = options.expected ?? 0;
		this.actual = options.actual ?? 0;
		this.comparisonOperator = options.comparisonOperator ?? ComparisonOperator.EqualTo;
	}

	get isCompleted(): boolean {
		if(comparisonOperatorMap[this.comparisonOperator](this.actual, this.expected)) {
			return true;
		}
		else {
			return false;
		}
	}

	setActual(newValue: number) {
		let prevIsCompleted = this.isCompleted;

		(this.actual as number) = newValue;

		let isCompleted = this.isCompleted;

		this.emit("actualChange");
		this.emit("update");

		if(prevIsCompleted !== isCompleted) {
			if(isCompleted === true) {
				this.emit("complete");
			}
			else {
				this.emit("uncomplete");
			}
		}
	}

	increment() {
		return this.setActual(this.actual + 1);
	}

	decrement() {
		return this.setActual(this.actual - 1);
	}

	static fromJSON(plainObj: ISerializedCounterTask) {
		return new CounterTask(
			{
				...PartialClassTask.createOptionObjFromPlainObj(plainObj),

				expected: plainObj.expected,
				actual: plainObj.actual,
				comparisonOperator: plainObj.comparisonOperator,
			}
		);
	}

	toJSON(): ISerializedCounterTask {
		let res: ISerializedCounterTask = <ISerializedCounterTask>PartialClassTask.toJSON.call(this);

		res._type = "CounterTask";
		
		res.expected = this.expected;
		res.actual = this.actual;
		res.comparisonOperator = this.comparisonOperator;
		
		return res;
	}
}