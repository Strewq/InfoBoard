import EventEmitter from "eventemitter3";
import IGadget from "./IGadget";
import IStringList from "./IStringList";
import IMessage from "./IMessage";
import IRegularTask from "./IRegularTask";
import ICounterTask from "./ICounterTask";
import ITimer from "./ITimer";
import IStopwatch from "./IStopwatch";
import ITypedSerializable from "./ITypedSerializable";
import IEventEmittingOrderedMap from "./IEventEmittingOrderedMap";

export default interface ICore {
	stringLists: IEventEmittingOrderedMap<string, IStringList & EventEmitter & IGadget> & ITypedSerializable;
	messages: IEventEmittingOrderedMap<string, IMessage & IGadget> & ITypedSerializable;
	regularTasks: IEventEmittingOrderedMap<string, IRegularTask & EventEmitter & IGadget> & ITypedSerializable;
	counterTasks: IEventEmittingOrderedMap<string, ICounterTask & EventEmitter & IGadget> & ITypedSerializable;
	timers: IEventEmittingOrderedMap<string, ITimer & EventEmitter & IGadget> & ITypedSerializable;
	stopwatches: IEventEmittingOrderedMap<string, IStopwatch & EventEmitter & IGadget> & ITypedSerializable;

	getItemsFromStorage(): void;
	sendItemsToStorage(): void;

	saveStateToFile(): void;
	loadStateFromFile(): Promise<void>;
}