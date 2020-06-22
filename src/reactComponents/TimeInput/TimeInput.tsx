import React from "react";
import ITimeTerm from "../../types/ITimeTerm";
import TimepointInput from "./TimepointInput";
import TimeTermInput from "./TimeTermInput";
import {addTimeTermToTimepoint} from "../../common/timeTermFuncs";
import TimeTerm from "../../classes/TimeTerm";
import css from "./style.scss";
import nullIcon from "../../imgs/nullIcon.svg";
import timepointIcon from "../../imgs/timepointIcon.svg";
import timeTermIcon from "../../imgs/timeTermIcon.svg";

type Mode = "null" | "timepoint" | "timeTerm";

type Props = {
	value: number | ITimeTerm | null,
	withNullButton: boolean,
	utc: boolean,
	partSetMode: "transfer" | "close",
	onUpdate: (newValue: number | ITimeTerm | null) => void
};

function getMode(value: number | ITimeTerm | null): Mode {
	if(value === null) {
		return "null";
	}
	else if(typeof value === "number") {
		return "timepoint";
	}
	else {
		return "timeTerm";
	}
}

export default class TimeInput extends React.PureComponent<Props> {
	static defaultProps = {
		withNullButton: false,
		utc: false,
		partSetMode: "transfer",
	};

	onUpdate = (newValue: number | ITimeTerm | null) => {
		this.props.onUpdate(newValue);
	};

	modeChangeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let oldMode: Mode = getMode(this.props.value);
		let newMode: Mode = e.currentTarget.value as Mode;

		if(oldMode === newMode) {
			return;
		}

		if(newMode === "null") {
			this.props.onUpdate(null);
		}
		else if(newMode === "timepoint") {
			if(oldMode === "timeTerm") {
				this.props.onUpdate(addTimeTermToTimepoint(Date.now(), new TimeTerm(this.props.value as ITimeTerm)));
			}
			else {
				this.props.onUpdate(Date.now());
			}
		}
		else if(newMode === "timeTerm") {
			if(oldMode === "timepoint") {
				this.props.onUpdate(new TimeTerm(this.props.value as number, Date.now()));
			}
			else {
				this.props.onUpdate(new TimeTerm());
			}
		}
	};

	render() {
		let input: JSX.Element;
		let commonProps = {
			onUpdate: this.props.onUpdate,
			withNullButton: false,
			partSetMode: this.props.partSetMode
		};

		let mode = getMode(this.props.value);
		
		if(mode === "null") {
			input = <span className={css.nullValue}>Null</span>;
		}
		else if(mode === "timepoint") {
			input = <TimepointInput value={this.props.value as number} {...commonProps} utc={this.props.utc} />;
		}
		else {
			input = <TimeTermInput value={this.props.value as ITimeTerm} {...commonProps} />;
		}

		let nullButton: JSX.Element | null;
		if(this.props.withNullButton) {
			nullButton = <button value="null" className={`${css.modeButton} ${mode === "null" ? css.checked : ""}`} onClick={this.modeChangeHandler}>
				<img src={nullIcon} />
			</button>;
		}
		else {
			nullButton = null;
		}

		return <div className={css.timeInput}>
			{input}
			<div className={css.buttonContainer}>
				<button value="timepoint" className={`${css.modeButton} ${mode === "timepoint" ? css.checked : ""}`} onClick={this.modeChangeHandler}>
					<img src={timepointIcon} />
				</button>
				<button value="timeTerm" className={`${css.modeButton} ${mode === "timeTerm" ? css.checked : ""}`} onClick={this.modeChangeHandler}>
					<img src={timeTermIcon} />
				</button>
				{nullButton}
			</div>
		</div>;
	}
}