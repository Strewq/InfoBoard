import React from "react";
import Stage from "../../types/Stage";
import {timeNumToTimeStr} from "../../common/timeFuncs";
import {getTimeTermGreatestPartStr, getTimelengthWithoutGreatestPart} from "../../common/timeTermFuncs";
import setTimer, {IClearer} from "../../common/setTimer";
import ITimeLimits from "../../types/ITimeLimits";
import EventEmitter from "eventemitter3";
import memoizeOne from "memoize-one";
import ITimeSource from "../../types/ITimeSource";
import playAudioEffect from "../../ui/playAudioEffect";

function getStrFromTimeNumOrNull(time: number | null) {
	if(time === null) {
		return "null";
	}
	else {
		return timeNumToTimeStr(time);
	}
}

function getStartAndEndTimesString(startTime: number | null, endTime: number | null) {
	return `Start Time: ${getStrFromTimeNumOrNull(startTime)}\nEnd Time: ${getStrFromTimeNumOrNull(endTime)}`;
}

type Props = {
	timeLimits: ITimeLimits & EventEmitter
};

export default class TimeState extends React.PureComponent<Props> {
	static timeSource: ITimeSource = Date;
	
	countdownRef: React.RefObject<HTMLSpanElement> = React.createRef();
	renderCountdownTimerClearer: IClearer | null = null;

	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.timeLimits !== this.props.timeLimits) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.timeLimits.addListener("update", this.update, this);
		props.timeLimits.addListener("stageChange", this.stateChangeHandler, this);

		this.setTimerToUpdateCountdown();
	}

	deinit(props: Props) {
		props.timeLimits.removeListener("update", this.update, this);
		props.timeLimits.removeListener("stageChange", this.stateChangeHandler, this);

		this.renderCountdownTimerClearer?.clear();
	}	

	update = () => {
		this.forceUpdate();
	};

	stateChangeHandler() {
		playAudioEffect("ringing");
	}

	setTimerToUpdateCountdown() {
		if(this.props.timeLimits.currentTargetTime === null) {
			return;
		}
		
		let countdownToNextTick = getTimelengthWithoutGreatestPart(this.props.timeLimits.currentTargetTime, TimeState.timeSource.now());
		if(countdownToNextTick === 0) {
			countdownToNextTick = 40; // this number is just to reduce the render frequency of the countdown. it can be an arbitrary number
		}

		this.renderCountdownTimerClearer = setTimer(countdownToNextTick, this.renderCountdown, this);
	}

	renderCountdown() {
		if(this.countdownRef.current === null || this.props.timeLimits.currentTargetTime === null) {
			return;
		}

		this.countdownRef.current.textContent = this.getCountdownStr();

		this.setTimerToUpdateCountdown();
	}

	getCountdownStr() {
		let countdownTimeTerm = this.props.timeLimits.getTimeTermToCurrentTargetTime();
		
		if(countdownTimeTerm === null) {
			return "null";
		}
		else {
			return getTimeTermGreatestPartStr(countdownTimeTerm);
		}
	}

	getStartAndEndTimesString = memoizeOne(getStartAndEndTimesString);

	render() {
		let timeLimits = this.props.timeLimits;
		let stage = timeLimits.stage;

		let timeState: JSX.Element;

		switch(stage) {
			case Stage.Before: {
				timeState = (
					<>
						<span>Task will start in</span>
						{" "}
						<span ref={this.countdownRef}>{this.getCountdownStr()}</span>
					</>
				);
				break;
			}
			case Stage.InProgress: {
				if(timeLimits.endTime === null) {
					timeState = (
						<span>Task in progress</span>
					);
				}
				else {
					timeState = (
						<>
							<span>Task will end in</span>
							{" "}
							<span ref={this.countdownRef}>{this.getCountdownStr()}</span>
						</>
					);
				}
				break;
			}
			case Stage.After: {
				timeState = (
					<span>Task timed out</span>
				);
				break;
			}
		}
	
		return <span title={this.getStartAndEndTimesString(timeLimits.startTime, timeLimits.endTime)}>{timeState}</span>;
	}
}