import React from "react";
import ScrollableInput from "../ScrollableInput/ScrollableInput";
import TimePartNameType from "../../types/TimePartNameType";
import css from "./style.scss";

function convert(value: number, padLength: number) {
	if(Number.isNaN(value)) {
		return "-".padStart(padLength, "-");
	}
	else {
		return value.toString(10).padStart(padLength, "0");
	}
}

type Props = {
	values: {
		prev: number,
		cur: number,
		next: number
	},
	padLength: number,
	partName: TimePartNameType,
	onUpdate: (indexShift: number, partName: TimePartNameType) => void
};

export default class TimeInputPart extends React.PureComponent<Props> {
	onUpdate = (indexShift: number) => {
		this.props.onUpdate(indexShift, this.props.partName);
	};
	
	dblclickHandler = () => {
		let indexShift = -this.props.values.cur;
		
		this.props.onUpdate(indexShift, this.props.partName);
	};
	
	render() {
		return <span className={css.inputPartContainer} data-part={this.props.partName}>
			<ScrollableInput
				values={{
					prev: convert(this.props.values.prev, this.props.padLength),
					cur: convert(this.props.values.cur, this.props.padLength),
					next: convert(this.props.values.next, this.props.padLength)
				}}
				onUpdate={this.onUpdate}
				doubleClickHandler={this.dblclickHandler}
			/>
		</span>;
	}
}