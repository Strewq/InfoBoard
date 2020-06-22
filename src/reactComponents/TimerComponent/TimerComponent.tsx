import React from "react";
import ITimer from "../../types/ITimer"
import IGadget from "../../types/IGadget";
import EventEmitter from "eventemitter3";
import {getTimeTermGreatestPartStr, getTimelengthWithoutGreatestPart} from "../../common/timeTermFuncs";
import setTimer, {IClearer} from "../../common/setTimer";
import ITimeSource from "../../types/ITimeSource";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import {timeNumToTimeStr} from "../../common/timeFuncs";
import memoizeOne from "memoize-one";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import countdownElemCss from "./countdownElem.scss";
import fractionCss from "./fraction.scss";
import fractionalBarIcon from "../../imgs/fractionalBarIcon.svg";
// import confirmReceiptButtonCss from "./confirmReceiptButton.scss";
import timerComponentCss from "./TimerComponent.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import MoveArrows from "../MoveArrows/MoveArrows";
import playAudioEffect from "../../ui/playAudioEffect";

function getTargetTimesStr(targetTimes: number[]) {
	let timeStrs: string[] = [];

	for(let [i, time] of targetTimes.entries()) {
		timeStrs[i] = `${i} time: ${timeNumToTimeStr(time)}`;
	}

	return timeStrs.join("\n");
}

type Props = {
	timer: ITimer & EventEmitter & IGadget,
	deleteTimer: (timer: ITimer & EventEmitter & IGadget) => void,
	timerMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class TimerComponent extends React.PureComponent<Props> {
	static timeSource: ITimeSource = Date;
	
	countdownRef: React.RefObject<HTMLSpanElement> = React.createRef();
	renderCountdownTimerClearer: IClearer | null = null;

	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.timer !== this.props.timer || prevProps.deleteTimer !== this.props.deleteTimer) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.timer.addListener("update", this.update, this);
		props.timer.addListener("targetTimeCome", this.targetTimeComeHandler, this);

		this.setTimerToUpdateCountdown();
	}

	deinit(props: Props) {
		props.timer.removeListener("update", this.update, this);
		props.timer.removeListener("targetTimeCome", this.targetTimeComeHandler, this);

		this.renderCountdownTimerClearer?.clear();
	}

	update = () => {
		this.forceUpdate();
	};

	targetTimeComeHandler() {
		playAudioEffect("ringing");
	}

	// confirmReceipt = () => {
	// 	this.props.timer.confirmReceipt();
	// };

	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteTimer(this.props.timer);
	};

	setTimerToUpdateCountdown() {
		if(this.props.timer.currentTargetTime === null) {
			return;
		}

		let countdownToNextTick = getTimelengthWithoutGreatestPart(this.props.timer.currentTargetTime, TimerComponent.timeSource.now());
		if(countdownToNextTick === 0) {
			countdownToNextTick = 40; // this number is just to reduce the render frequency of the countdown. it can be an arbitrary number
		}

		this.renderCountdownTimerClearer = setTimer(countdownToNextTick, this.renderCountdown, this);
	}

	renderCountdown() {
		if(this.countdownRef.current === null || this.props.timer.currentTargetTime === null) {
			return;
		}

		this.countdownRef.current.textContent = this.getCountdownStr();

		this.setTimerToUpdateCountdown();
	}
	
	getCountdownStr() {
		let countdownTimeTerm = this.props.timer.getTimeTermToCurrentTargetTime();
		
		if(countdownTimeTerm === null) {
			return null;
		}
		else {
			return getTimeTermGreatestPartStr(countdownTimeTerm);
		}
	}

	getCountdownElem() {
		let countdownStr = this.getCountdownStr();

		let isOver = countdownStr === null;
		
		countdownStr = countdownStr ?? "Is Over";

		return <span ref={this.countdownRef} className={`${css.flex} ${countdownElemCss.countdownElem} ${isOver ? css.noData : ""}`}>{countdownStr}</span>;
	}

	getTargetTimesStr = memoizeOne(getTargetTimesStr);

	render() {
		let name = this.props.timer.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.timer.name}</span>
		;

		let tagList = this.props.timer.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.timer.tags} />
		;

		// let isReceiptConfirmed = this.props.timer.isReceiptConfirmed;
		
		return <div className={`${css.commonGadgetComponent} ${timerComponentCss.timerComponent}`}>
			<MoveArrows map={this.props.timerMap} mapKey={this.props.timer.uuid} />
			{name}
			<span title={this.getTargetTimesStr(this.props.timer.targetTimes)} className={`${css.flex} ${fractionCss.fraction}`}>
				<span className={fractionCss.numerator}>{this.props.timer.currentTimePeriodIndex}</span>
				<span className={fractionCss.line}><img src={fractionalBarIcon} /></span>
				<span className={fractionCss.denominator}>{this.props.timer.targetTimes.length}</span>
			</span>
			{this.getCountdownElem()}
			{/* <button className={confirmReceiptButtonCss.confirmReceiptButton} disabled={isReceiptConfirmed ? true : false} style={{borderStyle: "solid", borderWidth: "3px", borderColor: (isReceiptConfirmed ? "green" : "red")}} onClick={this.confirmReceipt}>Confirm Receipt</button> */}
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}