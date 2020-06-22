import React from "react";
import IStopwatch from "../../types/IStopwatch";
import IGadget from "../../types/IGadget";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import EventEmitter from "eventemitter3";
import ITimeSource from "../../types/ITimeSource";
import setTimer, {IClearer} from "../../common/setTimer";
import {getShortTimeTermStr} from "../../common/timeTermFuncs";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import toogleButtonCss from "./toogleButton.scss";
import clearButtonCss from "./clearButton.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import elapsedElemCss from "./elapsedElem.scss";
import stopwatchComponentCss from "./StopwatchComponent.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import MoveArrows from "../MoveArrows/MoveArrows";

type Props = {
	stopwatch: IStopwatch & EventEmitter & IGadget,
	deleteStopwatch: (stopwatch: IStopwatch & EventEmitter & IGadget) => void,
	stopwatchMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class StopwatchComponent extends React.PureComponent<Props> {
	static timeSource: ITimeSource = Date;

	static formatData = {
		format: 0b1111110,
		delimiters: [".", ".", " ", ":", ":"],
		paddings: [2, 2, 2, 2, 2, 2],
	};
	
	elapsedRef: React.RefObject<HTMLSpanElement> = React.createRef();
	renderElapsedTimerClearer: IClearer | null = null;
	
	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.stopwatch !== this.props.stopwatch || prevProps.deleteStopwatch !== this.props.deleteStopwatch) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.stopwatch.addListener("update", this.update, this);

		this.setTimerToUpdateElapsed();
	}

	deinit(props: Props) {
		props.stopwatch.removeListener("update", this.update, this);

		this.renderElapsedTimerClearer?.clear();
	}

	update = () => {
		this.forceUpdate();

		if(this.props.stopwatch.isStarted) {
			this.setTimerToUpdateElapsed();
		}
		else {
			this.renderElapsedTimerClearer?.clear();
		}
	};
	
	toggleButtonClickHandler = () => {
		this.props.stopwatch.toggle();
	};

	clearButtonClickHandler = () => {
		this.props.stopwatch.clear();
	};
	
	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteStopwatch(this.props.stopwatch);
	};

	setTimerToUpdateElapsed() {
		if(!this.props.stopwatch.isStarted) {
			return;
		}

		let countdownToNextTick = 1000 - (this.props.stopwatch.getTotalTimelength()! % 1000);

		this.renderElapsedTimerClearer = setTimer(countdownToNextTick, this.renderElapsed, this);
	}

	renderElapsed() {
		if(this.elapsedRef.current === null) {
			return;
		}

		this.elapsedRef.current.textContent = this.getElapsedStr();

		this.setTimerToUpdateElapsed();
	}

	getElapsedStr() {
		let elapsedTimeTerm = this.props.stopwatch.getTotalTimeTerm();

		if(elapsedTimeTerm === null) {
			return null;
		}
		else {
			return getShortTimeTermStr(elapsedTimeTerm, StopwatchComponent.formatData.format, StopwatchComponent.formatData.delimiters, StopwatchComponent.formatData.paddings);
		}
	}

	getElapsedElem() {
		let elapsedStr = this.getElapsedStr();

		let isStarted = elapsedStr !== null;
		
		elapsedStr = elapsedStr ?? "Not Started";
		
		return <span ref={this.elapsedRef} className={`${elapsedElemCss.elapsedElem} ${css.flex} ${isStarted ? "": css.noData}`}>{elapsedStr}</span>
	}
	
	render() {
		let name = this.props.stopwatch.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.stopwatch.name}</span>
		;

		let tagList = this.props.stopwatch.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.stopwatch.tags} />
		;

		return <div className={`${css.commonGadgetComponent} ${stopwatchComponentCss.stopwatchComponent}`}>
			<MoveArrows map={this.props.stopwatchMap} mapKey={this.props.stopwatch.uuid} />
			{name}
			{this.getElapsedElem()}
			<button className={toogleButtonCss.toogleButton} onClick={this.toggleButtonClickHandler}>Toggle</button>
			<button className={clearButtonCss.clearButton} onClick={this.clearButtonClickHandler}>Clear</button>
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}