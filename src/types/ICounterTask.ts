import ITask from "./ITask";
import ComparisonOperator from "./ComparisonOperator";

export default interface ICounterTask extends ITask {
	readonly expected: number,
	readonly actual: number,

	readonly comparisonOperator: ComparisonOperator;

	setActual(newValue: number): void,

	increment(): void,
	decrement(): void
}