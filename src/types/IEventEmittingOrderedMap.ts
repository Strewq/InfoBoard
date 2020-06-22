import EventEmitter from "eventemitter3";

export default interface IEventEmittingOrderedMap<K, V> extends Map<K, V>, EventEmitter {
	readonly order: readonly K[];
	
	setWithoutEvents(key: K, value: V): this;

	deleteWithoutEvents(key: K): boolean;

	reset(entries: Iterable<[K, V]>, order: readonly K[]): void;

	atIndex(index: number): V | undefined;

	getIndexByKey(key: K): number;

	moveItem(srcIndex: number, dstIndex: number): void;
}