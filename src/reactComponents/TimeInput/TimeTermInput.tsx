import React from "react";
import TimeInputPart from "./TimeInputPart";
import css from "./style.scss";
import TimePartNameType from "../../types/TimePartNameType";
import ITimeTerm from "../../types/ITimeTerm";
import TimeTerm from "../../classes/TimeTerm";
import {addToPart} from "../../common/timeTermFuncs";
import ITimeSource from "../../types/ITimeSource";
import strModeToTimePartSetModeMap from "./strModeToTimePartSetModeMap";
import deleteIcon from "../../imgs/deleteIcon.svg";

type Props = {
	value: ITimeTerm | null,
	withNullButton: boolean,
	partSetMode: "transfer" | "close",
	onUpdate: (newValue: ITimeTerm | null) => void
};

export default class TimeTermInput extends React.PureComponent<Props> {
	static timeSource: ITimeSource = Date;
	
	static defaultProps = {
		withNullButton: true,
		partSetMode: "transfer"
	};

	onUpdate = (indexShift: number, partName: TimePartNameType) => {
		if(this.props.value === null) {
			this.props.onUpdate(new TimeTerm());
			return;
		}
		
		let newValue = new TimeTerm(this.props.value);
		newValue.setPart(newValue.getPart(partName) + indexShift, partName, strModeToTimePartSetModeMap[this.props.partSetMode]);

		this.props.onUpdate(newValue);
	};

	nullButtonClickHandler = () => {
		this.props.onUpdate(null);
	}

	signClickHandler = () => {
		if(this.props.value !== null) {
			let newValue = new TimeTerm(this.props.value);
			newValue.setSign(this.props.value.getSign() === 1 ? -1 : 1);
			
			this.props.onUpdate(newValue);
		}
	};
	
	render() {
		let partSetMode = strModeToTimePartSetModeMap[this.props.partSetMode];

		let timeTerm = this.props.value ?? new TimeTerm(null);
		
		let nullButton: JSX.Element | null = null;
		if(this.props.withNullButton) {
			nullButton = <button onClick={this.nullButtonClickHandler} className={css.nullButton}>
				<img src={deleteIcon} />
			</button>;
		}

		let y = <TimeInputPart partName={"y"} values={{
			prev: addToPart(-1, timeTerm, "y", partSetMode),
			cur: timeTerm.getPart("y"),
			next: addToPart(1, timeTerm, "y", partSetMode)
		}} padLength={1} onUpdate={this.onUpdate} />;

		let mo = <TimeInputPart partName={"mo"} values={{
			prev: addToPart(-1, timeTerm, "mo", partSetMode),
			cur: timeTerm.getPart("mo"),
			next: addToPart(1, timeTerm, "mo", partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let d = <TimeInputPart partName={"d"} values={{
			prev: addToPart(-1, timeTerm, "d", partSetMode),
			cur: timeTerm.getPart("d"),
			next: addToPart(1, timeTerm, "d", partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let h = <TimeInputPart partName={"h"} values={{
			prev: addToPart(-1, timeTerm, "h", partSetMode),
			cur: timeTerm.getPart("h"),
			next: addToPart(1, timeTerm, "h", partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let m = <TimeInputPart partName={"m"} values={{
			prev: addToPart(-1, timeTerm, "m", partSetMode),
			cur: timeTerm.getPart("m"),
			next: addToPart(1, timeTerm, "m", partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let s = <TimeInputPart partName={"s"} values={{
			prev: addToPart(-1, timeTerm, "s", partSetMode),
			cur: timeTerm.getPart("s"),
			next: addToPart(1, timeTerm, "s", partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let ms = <TimeInputPart partName={"ms"} values={{
			prev: addToPart(-1, timeTerm, "ms", partSetMode),
			cur: timeTerm.getPart("ms"),
			next: addToPart(1, timeTerm, "ms", partSetMode)
		}} padLength={3} onUpdate={this.onUpdate} />;

		let sign = <span className={css.sign} onClick={this.signClickHandler}>{timeTerm.getSign() === -1 ? "-" : "+"}</span>;
		
		return <span className={css.timeCommonInput}>
			<div>
				{sign}{y}.{mo}.{d}
			</div>
			<div>
				{h}:{m}:{s}.{ms}
			</div>
			{nullButton}
		</span>;
	}
}