import ITypedSerializable from "../types/ITypedSerializable";
import IEventEmittingOrderedMap from "../types/IEventEmittingOrderedMap";
import applyMixins from "../common/applyMixins";
import EventEmitter from "eventemitter3";

export interface ISerializedEventEmittingMap<K, V> {
	_type: "EventEmittingOrderedMap",

	content: [K, V][],
	order: K[]
}

export default interface EventEmittingOrderedMap<K, V> extends EventEmitter {}
export default class EventEmittingOrderedMap<K, V> extends Map<K, V> implements IEventEmittingOrderedMap<K, V>, ITypedSerializable {
	readonly order: readonly K[] = [];
	
	static fromJSON<K, V>(plainObj: ISerializedEventEmittingMap<K, V>) {
		return new EventEmittingOrderedMap<K, V>(plainObj.content, plainObj.order);
	}

	constructor(entries?: Iterable<[K, V]>, order?: K[]) {
		super();
		
		let eventEmitter = new EventEmitter();
		Object.assign(this, eventEmitter);

		this.reset(entries ?? [], order ?? []);
	}

	toJSON(): ISerializedEventEmittingMap<K, V> {
		return {
			_type: "EventEmittingOrderedMap",

			content: [...super.entries()],
			order: [...this.order]
		};
	}

	setWithoutEvents(key: K, value: V) {
		return super.set(key, value);
	}

	deleteWithoutEvents(key: K) {
		return super.delete(key);
	}

	set(key: K, value: V) {
		if(this.has(key)) {
			this.delete(key);
		}

		super.set(key, value);

		(this.order as K[]).push(key);

		this.emit("setItem", key);
		this.emit("update");

		return this;
	}

	delete(key: K) {
		let deletedValue = this.get(key);

		let isDeleted = super.delete(key);

		if(isDeleted) {
			let deletedItemIndex = this.getIndexByKey(key);
			(this.order as K[]).splice(deletedItemIndex, 1);
			
			this.emit("deleteItem", deletedValue);
			this.emit("update");
		}

		return isDeleted;
	}

	reset(values: Iterable<[K, V]>, order: readonly K[]) {
		for(let key of super.keys()) {
			this.delete(key);
		}

		for(let [key, value] of values) {
			this.set(key, value);
		}

		if(order.length === this.size) {
			(this.order as K[]) = [...order];
		}
	}

	atIndex(index: number) {
		return this.get(this.order[index]);
	}

	getIndexByKey(key: K) {
		return this.order.indexOf(key);
	}

	moveItem(srcIndex: number, dstIndex: number) {
		if(srcIndex >= this.order.length || srcIndex < 0) {
			return;
		}
		if(dstIndex >= this.order.length || dstIndex < 0) {
			return
		}
		
		let movedItem = (this.order as K[]).splice(srcIndex, 1)[0];
		(this.order as K[]).splice(dstIndex, 0, movedItem);

		this.emit("moveItem", srcIndex, dstIndex);
		this.emit("update");
	}

	[Symbol.iterator]() {
		return this.entries();
	}

	entries() {
		type resType = typeof res & {
			[Symbol.iterator](): resType
		};

		let res = {
			self: this,
			currentIndex: 0,
			
			next() {
				if(this.currentIndex >= this.self.order.length) {
					return {
						value: undefined,
						done: true as true
					};
				}
				
				let key = this.self.order[this.currentIndex];
				++this.currentIndex;

				return {
					value: [key, this.self.get(key)] as [K, V],
					done: false as false
				};
			}
		};
		(res as resType)[Symbol.iterator] = () => res as resType;

		return res as resType;
	}

	keys() {
		type resType = typeof res & {
			[Symbol.iterator](): resType
		};

		let res = {
			self: this,
			currentIndex: 0,
			
			next() {
				if(this.currentIndex >= this.self.order.length) {
					return {
						value: undefined,
						done: true as true
					};
				}
				
				let key = this.self.order[this.currentIndex];
				++this.currentIndex;

				return {
					value: key,
					done: false as false
				};
			}
		};
		(res as resType)[Symbol.iterator] = () => res as resType;
		
		return res as resType;
	}

	values() {
		type resType = typeof res & {
			[Symbol.iterator](): resType
		};

		let res = {
			self: this,
			currentIndex: 0,
			
			next() {
				if(this.currentIndex >= this.self.order.length) {
					return {
						value: undefined,
						done: true as true
					};
				}
				
				let key = this.self.order[this.currentIndex];
				++this.currentIndex;

				return {
					value: this.self.get(key)!,
					done: false as false
				};
			}
		};
		(res as resType)[Symbol.iterator] = () => res as resType;
		
		return res as resType;
	}

	forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
		for(let [key, value] of this.entries()) {
			callbackfn.call(thisArg, value, key, this);
		}
	}
}
applyMixins(EventEmittingOrderedMap, [EventEmitter]);