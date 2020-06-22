import {ITypedDeserializator} from "../types/ITypedSerializable";
import Reviver from "../classes/Reviver";

import EventEmittingOrderedMap from "../classes/EventEmittingOrderedMap";
import RegularTask from "../classes/RegularTask";
import CounterTask from "../classes/CounterTask";
import StringList from "../classes/StringList";
import Message from "../classes/Message";
import TimeLimits from "../classes/TimeLimits";
import Stopwatch from "../classes/Stopwatch";
import Timer from "../classes/Timer";

export default function getCoreReviver() {
	let reviver = new Reviver();

	reviver.deserializators.set("EventEmittingOrderedMap", <ITypedDeserializator>EventEmittingOrderedMap.fromJSON);
	reviver.deserializators.set("RegularTask", <ITypedDeserializator>RegularTask.fromJSON);
	reviver.deserializators.set("CounterTask", <ITypedDeserializator>CounterTask.fromJSON);
	reviver.deserializators.set("StringList", <ITypedDeserializator>StringList.fromJSON);
	reviver.deserializators.set("Message", <ITypedDeserializator>Message.fromJSON);
	reviver.deserializators.set("TimeLimits", <ITypedDeserializator>TimeLimits.fromJSON);
	reviver.deserializators.set("Stopwatch", <ITypedDeserializator>Stopwatch.fromJSON);
	reviver.deserializators.set("Timer", <ITypedDeserializator>Timer.fromJSON);

	return reviver;
}