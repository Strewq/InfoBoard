import React from "react";
import RegularTaskAddForm, {Props as regularTaskAddFormProps} from "../RegularTaskAddForm/RegularTaskAddForm";
import CounterTaskAddForm, {Props as counterTaskAddFormProps} from "../CounterTaskAddForm/CounterTaskAddForm";
import StringListGadgetAddForm, {Props as stringListGadgetAddFormProps} from "../StringListGadgetAddForm/StringListGadgetAddForm";
import MessageAddForm, {Props as messageAddFormProps} from "../MessageAddForm/MessageAddForm";
import TimerAddForm, {Props as timerAddFormProps} from "../TimerAddForm/TimerAddForm";
import StopwatchAddForm, {Props as stopwatchAddFormProps} from "../StopwatchAddForm/StopwatchAddForm";
import css from "./Sidebar.scss";
import deleteIcon from "../../imgs/deleteIcon.svg"
import addRegularTaskIcon from "../../imgs/addRegularTaskIcon.svg";
import addCounterTaskIcon from "../../imgs/addCounterTaskIcon.svg";
import addStringListIcon from "../../imgs/addStringListIcon.svg";
import addMessageIcon from "../../imgs/addMessageIcon.svg";
import addTimerIcon from "../../imgs/addTimerIcon.svg";
import addStopwatchIcon from "../../imgs/addStopwatchIcon.svg";
import downloadIcon from "../../imgs/downloadIcon.svg";
import uploadIcon from "../../imgs/uploadIcon.svg";

type Props = {
	addRegularTask: regularTaskAddFormProps["add"],
	addCounterTask: counterTaskAddFormProps["add"],
	addStringListGadget: stringListGadgetAddFormProps["add"],
	addMessage: messageAddFormProps["add"],
	addTimer: timerAddFormProps["add"],
	addStopwatch: stopwatchAddFormProps["add"],
	downloadState: () => void,
	uploadState: () => void
};

type State = {
	whatForm: WhatForm | null
};

type WhatForm =
	"regularTask" |
	"counterTask" |
	"stringList" |
	"message" |
	"timer" |
	"stopwatch"
;

export default class Sidebar extends React.PureComponent<Props, State> {
	state = {
		whatForm: null
	};

	containerRef = React.createRef<HTMLDivElement>();
	
	addGadgetButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let newValue = (e.target as HTMLButtonElement).value as WhatForm;

		if(newValue === this.state.whatForm) {
			this.setStateWhatForm(null);
		}
		else {
			this.setStateWhatForm(newValue);
		}
	};

	downloadButtonClickHandler = () => {
		this.props.downloadState();
	};

	uploadButtonClickHandler = () => {
		this.props.uploadState();
	};

	closeForm = () => {
		this.setStateWhatForm(null);
	};

	setStateWhatForm(newValue: WhatForm | null) {
		let oldValue = this.state.whatForm;

		if(oldValue === null && newValue !== null) {
			(this.containerRef.current!.querySelector(`.${css.fixedContainer}`) as HTMLElement).style.pointerEvents = "initial";
			document.addEventListener("click", this.documentClickHandler);
		}
		else if(oldValue !== null && newValue === null) {
			(this.containerRef.current!.querySelector(`.${css.fixedContainer}`) as HTMLElement).style.pointerEvents = "";
			document.removeEventListener("click", this.documentClickHandler);
		}

		this.setState({whatForm: newValue});
	}

	documentClickHandler = (e: MouseEvent) => {
		if(!e.composedPath().includes(this.containerRef.current!.querySelector(`.${css.selected}`)!)) {
			this.setStateWhatForm(null);
		}
	};
	
	render() {
		let closeButton = <button onClick={this.closeForm} className={css.closeButton}><img src={deleteIcon} /></button>;
		
		return <div ref={this.containerRef} className={css.Sidebar}>
			<div className={css.buttonContainer}>
				<button value="message" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addMessageIcon} className={css.addGadgetIcon} />
				</button>
				<button value="regularTask" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addRegularTaskIcon} className={css.addGadgetIcon} />
				</button>
				<button value="counterTask" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addCounterTaskIcon} className={css.addGadgetIcon} />
				</button>
				<button value="stringList" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addStringListIcon} className={css.addGadgetIcon} />
				</button>
				<button value="timer" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addTimerIcon} className={css.addGadgetIcon} />
				</button>
				<button value="stopwatch" className={css.button} onClick={this.addGadgetButtonClickHandler}>
					<img src={addStopwatchIcon} className={css.addGadgetIcon} />
				</button>
				<button className={css.button} onClick={this.downloadButtonClickHandler}>
					<img src={downloadIcon} />
				</button>
				<button className={css.button} onClick={this.uploadButtonClickHandler}>
					<img src={uploadIcon} />
				</button>
			</div>
			<div className={css.fixedContainer}>
				<div className={`${css.formContainer} ${this.state.whatForm === "message" ? css.selected : ""}`}>
					<MessageAddForm add={this.props.addMessage} />
					{closeButton}
				</div>
				<div className={`${css.formContainer} ${this.state.whatForm === "regularTask" ? css.selected : ""}`}>
					<RegularTaskAddForm add={this.props.addRegularTask} />
					{closeButton}
				</div>
				<div className={`${css.formContainer} ${this.state.whatForm === "counterTask" ? css.selected : ""}`}>
					<CounterTaskAddForm add={this.props.addCounterTask} />
					{closeButton}
				</div>
				<div className={`${css.formContainer} ${this.state.whatForm === "stringList" ? css.selected : ""}`}>
					<StringListGadgetAddForm add={this.props.addStringListGadget} />
					{closeButton}
				</div>
				<div className={`${css.formContainer} ${this.state.whatForm === "timer" ? css.selected : ""}`}>
					<TimerAddForm add={this.props.addTimer} />
					{closeButton}
				</div>
				<div className={`${css.formContainer} ${this.state.whatForm === "stopwatch" ? css.selected : ""}`}>
					<StopwatchAddForm add={this.props.addStopwatch} />
					{closeButton}
				</div>
			</div>
		</div>;
	}
}