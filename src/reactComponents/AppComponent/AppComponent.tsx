import React from "react";

import ICore from "../../types/ICore";
import IUiState from "../../types/IUiState";

import IGadget from "../../types/IGadget";
import EventEmitter from "eventemitter3";

import IRegularTask from "../../types/IRegularTask";
import RegularTaskComponent from "../RegularTaskComponent/RegularTaskComponent";

import ICounterTask from "../../types/ICounterTask";
import CounterTaskComponent from "../CounterTaskComponent/CounterTaskComponent";

import IStringList from "../../types/IStringList";
import StringListGadgetComponent from "../StringListGadgetComponent/StringListGadgetComponent";

import IMessage from "../../types/IMessage";
import MessageComponent from "../MessageComponent/MessageComponent";

import ITimer from "../../types/ITimer";
import TimerComponent from "../TimerComponent/TimerComponent";

import IStopwatch from "../../types/IStopwatch";
import StopwatchComponent from "../StopwatchComponent/StopwatchComponent";

import Sidebar from "../Sidebar/Sidebar";

import css from "./AppComponent.scss";

const empty = <span className={css.empty}>Empty</span>;

type Props = {
	core: ICore,
	uiState: IUiState
};

export default class AppComponent extends React.PureComponent<Props> {
	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.core !== this.props.core) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.core.regularTasks.addListener("setItem", this.update, this);
		props.core.regularTasks.addListener("deleteItem", this.update, this);
		props.core.regularTasks.addListener("moveItem", this.update, this);

		props.core.counterTasks.addListener("setItem", this.update, this);
		props.core.counterTasks.addListener("deleteItem", this.update, this);
		props.core.counterTasks.addListener("moveItem", this.update, this);

		props.core.stringLists.addListener("setItem", this.update, this);
		props.core.stringLists.addListener("deleteItem", this.update, this);
		props.core.stringLists.addListener("moveItem", this.update, this);

		props.core.messages.addListener("setItem", this.update, this);
		props.core.messages.addListener("deleteItem", this.update, this);
		props.core.messages.addListener("moveItem", this.update, this);

		props.core.timers.addListener("setItem", this.update, this);
		props.core.timers.addListener("deleteItem", this.update, this);
		props.core.timers.addListener("moveItem", this.update, this);

		props.core.stopwatches.addListener("setItem", this.update, this);
		props.core.stopwatches.addListener("deleteItem", this.update, this);
		props.core.stopwatches.addListener("moveItem", this.update, this);
	}

	deinit(props: Props) {
		props.core.regularTasks.removeListener("setItem", this.update, this);
		props.core.regularTasks.removeListener("deleteItem", this.update, this);
		props.core.regularTasks.removeListener("moveItem", this.update, this);

		props.core.counterTasks.removeListener("setItem", this.update, this);
		props.core.counterTasks.removeListener("deleteItem", this.update, this);
		props.core.counterTasks.removeListener("moveItem", this.update, this);

		props.core.stringLists.removeListener("setItem", this.update, this);
		props.core.stringLists.removeListener("deleteItem", this.update, this);
		props.core.stringLists.removeListener("moveItem", this.update, this);

		props.core.messages.removeListener("setItem", this.update, this);
		props.core.messages.removeListener("deleteItem", this.update, this);
		props.core.messages.removeListener("moveItem", this.update, this);

		props.core.timers.removeListener("setItem", this.update, this);
		props.core.timers.removeListener("deleteItem", this.update, this);
		props.core.timers.removeListener("moveItem", this.update, this);

		props.core.stopwatches.removeListener("setItem", this.update, this);
		props.core.stopwatches.removeListener("deleteItem", this.update, this);
		props.core.stopwatches.removeListener("moveItem", this.update, this);
	}

	update = () => {
		this.forceUpdate();
	};

	addRegularTask = (regularTask: IRegularTask & EventEmitter & IGadget) => {
		this.props.core.regularTasks.set(regularTask.uuid, regularTask);
	};

	deleteRegularTask = (regularTask: IRegularTask & EventEmitter & IGadget) => {
		this.props.core.regularTasks.delete(regularTask.uuid);
	};

	addCounterTask = (counterTask: ICounterTask & EventEmitter & IGadget) => {
		this.props.core.counterTasks.set(counterTask.uuid, counterTask);
	};

	deleteCounterTask = (counterTask: ICounterTask & EventEmitter & IGadget) => {
		this.props.core.counterTasks.delete(counterTask.uuid);
	};

	addStringListGadget = (stringList: IStringList & EventEmitter & IGadget) => {
		this.props.core.stringLists.set(stringList.uuid, stringList);
	};

	deleteStringListGadget = (stringList: IStringList & EventEmitter & IGadget) => {
		this.props.core.stringLists.delete(stringList.uuid);
	};

	addMessage = (message: IMessage & IGadget) => {
		this.props.core.messages.set(message.uuid, message);
	};

	deleteMessage = (message: IMessage & IGadget) => {
		this.props.core.messages.delete(message.uuid);
	};

	addTimer = (timer: ITimer & EventEmitter & IGadget) => {
		this.props.core.timers.set(timer.uuid, timer);
	};

	deleteTimer = (timer: ITimer & EventEmitter & IGadget) => {
		this.props.core.timers.delete(timer.uuid);
	};

	addStopwatch = (stopwatch: IStopwatch & EventEmitter & IGadget) => {
		this.props.core.stopwatches.set(stopwatch.uuid, stopwatch);
	};

	deleteStopwatch = (stopwatch: IStopwatch & EventEmitter & IGadget) => {
		this.props.core.stopwatches.delete(stopwatch.uuid);
	};

	saveStateToFile = () => {
		this.props.core.saveStateToFile();
	};

	loadStateFromFile = () => {
		this.props.core.loadStateFromFile();
	};

	render() {
		let regularTasks = [...this.props.core.regularTasks.values()];
		let regularTaskComps =
			regularTasks.length !== 0 ?
			regularTasks.map((regularTask) => 
				<RegularTaskComponent key={regularTask.uuid} regularTask={regularTask} deleteRegularTask={this.deleteRegularTask} regularTaskMap={this.props.core.regularTasks} />
			) :
			empty
		;

		let counterTasks = [...this.props.core.counterTasks.values()];
		let counterTaskComps =
			counterTasks.length !== 0 ?
			counterTasks.map((counterTask) =>
				<CounterTaskComponent key={counterTask.uuid} counterTask={counterTask} deleteCounterTask={this.deleteCounterTask} counterTaskMap={this.props.core.counterTasks} />
			) :
			empty;

		let stringLists = [...this.props.core.stringLists.values()];
		let stringListComps =
			stringLists.length !== 0 ?
			stringLists.map((stringList) =>
				<StringListGadgetComponent key={stringList.uuid} stringList={stringList} deleteStringListGadget={this.deleteStringListGadget} stringListGadgetMap={this.props.core.stringLists} />
			) :
			empty;

		let messages = [...this.props.core.messages.values()];
		let messageComps =
			messages.length !== 0 ?
			messages.map((message) =>
				<MessageComponent key={message.uuid} message={message} deleteMessage={this.deleteMessage} messageMap={this.props.core.messages} />
			) :
			empty;

		let timers = [...this.props.core.timers.values()];
		let timerComps =
			timers.length !== 0 ?
			timers.map((timer) =>
				<TimerComponent key={timer.uuid} timer={timer} deleteTimer={this.deleteTimer} timerMap={this.props.core.timers} />
			) :
			empty;

		let stopwatches = [...this.props.core.stopwatches.values()];
		let stopwatchComps =
			stopwatches.length !== 0 ?
			stopwatches.map((stopwatch) =>
				<StopwatchComponent key={stopwatch.uuid} stopwatch={stopwatch} deleteStopwatch={this.deleteStopwatch} stopwatchMap={this.props.core.stopwatches} />
			) :
			empty;
		
		return (
			<div className={css.app}>
				<div className={css.left}>
					<Sidebar
						addMessage={this.addMessage}
						addRegularTask={this.addRegularTask}
						addCounterTask={this.addCounterTask}
						addStringListGadget={this.addStringListGadget}
						addTimer={this.addTimer}
						addStopwatch={this.addStopwatch}
						downloadState={this.saveStateToFile}
						uploadState={this.loadStateFromFile}
					/>
				</div>
				<div className={css.right}>
					<div className={css.componentSection}>
						<span>Messages</span>
						<ul>
							{messageComps}
						</ul>
					</div>
					<div className={css.componentSection}>
						<span>Regular Tasks</span>
						<ul>
							{regularTaskComps}
						</ul>
					</div>
					<div className={css.componentSection}>
						<span>Counter Tasks</span>
						<ul>
							{counterTaskComps}
						</ul>
					</div>
					<div className={css.componentSection}>
						<span>String Lists</span>
						<ul>
							{stringListComps}
						</ul>
					</div>
					<div className={css.componentSection}>
						<span>Timers</span>
						<ul>
							{timerComps}
						</ul>
					</div>
					<div className={css.componentSection}>
						<span>Stopwatches</span>
						<ul>
							{stopwatchComps}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}