import React from "react";
import TimeInputPart from "./TimeInputPart";
import css from "./style.scss";
import TimePartNameType from "../../types/TimePartNameType";
import UDate from "../../classes/UDate";
import {addToPart} from "../../common/uDateFuncs";
import strModeToTimePartSetModeMap from "./strModeToTimePartSetModeMap";
import deleteIcon from "../../imgs/deleteIcon.svg";

type Props = {
	value: number | null,
	withNullButton: boolean,
	utc: boolean,
	partSetMode: "transfer" | "close",
	onUpdate: (newValue: number | null) => void
};

export default class TimepointInput extends React.PureComponent<Props> {
	static defaultProps = {
		withNullButton: false,
		utc: false,
		partSetMode: "transfer"
	};

	onUpdate = (indexShift: number, partName: TimePartNameType) => {
		if(this.props.value === null) {
			this.props.onUpdate(0);
			return;
		}
		
		let date = new UDate(this.props.value);

		let newPartValue = date.getPart(partName, this.props.utc) + indexShift;

		date.setPart(newPartValue, partName, this.props.utc, strModeToTimePartSetModeMap[this.props.partSetMode]);

		this.props.onUpdate(date.getNum());
	};

	nullButtonClickHandler = () => {
		this.props.onUpdate(null);
	}

	render() {
		let utc = this.props.utc;
		let partSetMode = strModeToTimePartSetModeMap[this.props.partSetMode];
		let date = new UDate(this.props.value ?? NaN);

		let nullButton: JSX.Element | null = null;
		if(this.props.withNullButton) {
			nullButton = <button onClick={this.nullButtonClickHandler} className={css.nullButton}>
				<img src={deleteIcon} />
			</button>;
		}

		let y = <TimeInputPart partName={"y"} values={{
			prev: addToPart(-1, date, "y", utc, partSetMode),
			cur: date.getPart("y", this.props.utc),
			next: addToPart(1, date, "y", utc, partSetMode)
		}} padLength={1} onUpdate={this.onUpdate} />;

		let mo = <TimeInputPart partName={"mo"} values={{
			prev: addToPart(-1, date, "mo", utc, partSetMode) + 1,
			cur: date.getPart("mo", this.props.utc) + 1,
			next: addToPart(1, date, "mo", utc, partSetMode) + 1
		}} padLength={2} onUpdate={this.onUpdate} />;

		let d = <TimeInputPart partName={"d"} values={{
			prev: addToPart(-1, date, "d", utc, partSetMode),
			cur: date.getPart("d", this.props.utc),
			next: addToPart(1, date, "d", utc, partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let h = <TimeInputPart partName={"h"} values={{
			prev: addToPart(-1, date, "h", utc, partSetMode),
			cur: date.getPart("h", this.props.utc),
			next: addToPart(1, date, "h", utc, partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let m = <TimeInputPart partName={"m"} values={{
			prev: addToPart(-1, date, "m", utc, partSetMode),
			cur: date.getPart("m", this.props.utc),
			next: addToPart(1, date, "m", utc, partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let s = <TimeInputPart partName={"s"} values={{
			prev: addToPart(-1, date, "s", utc, partSetMode),
			cur: date.getPart("s", this.props.utc),
			next: addToPart(1, date, "s", utc, partSetMode)
		}} padLength={2} onUpdate={this.onUpdate} />;

		let ms = <TimeInputPart partName={"ms"} values={{
			prev: addToPart(-1, date, "ms", utc, partSetMode),
			cur: date.getPart("ms", this.props.utc),
			next: addToPart(1, date, "ms", utc, partSetMode)
		}} padLength={3} onUpdate={this.onUpdate} />;
	
		// it fixes bad layout
		let fixSpan = <span style={{width: 0, visibility: "hidden"}}>a</span>;

		return <span className={css.timeCommonInput}>
			<div>
				{fixSpan}{y}.{mo}.{d}
			</div>
			<div>
				{h}:{m}:{s}.{ms}
			</div>
			{nullButton}
		</span>;
	}
}