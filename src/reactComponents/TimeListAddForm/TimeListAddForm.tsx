import React from "react";
import createIdArr from "../../common/createIdArr";
import memoizeOne from "memoize-one";
import addIcon from "../../imgs/addIcon.svg";
import deleteIcon from "../../imgs/deleteIcon.svg";
import ITimeTerm from "../../types/ITimeTerm";
import TimeInput from "../TimeInput/TimeInput";
import css from "./TimeListAddForm.scss";

type Props = {
	times: (number | ITimeTerm)[],
	onUpdate: (newTimes: (number | ITimeTerm)[]) => void
};

type State = {
	inputValue: number | ITimeTerm,
	focusLiNum: number | null
};

export default class StringListAddForm extends React.PureComponent<Props, State> {
	state = {
		inputValue: Date.now(),
		focusLiNum: null
	};

	timeInputUpdateHandler = (index: number, newValue: number | ITimeTerm) => {
		let newTimes = [...this.props.times];

		newTimes[index] = newValue;

		this.props.onUpdate(newTimes);
	};

	deleteTimeButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let newTimes = [...this.props.times];

		newTimes.splice(Number((e.target as HTMLButtonElement).parentElement!.dataset.num), 1);

		this.props.onUpdate(newTimes);
	};

	newTimeInputUpdateHandler = (newValue: number | ITimeTerm | null) => {
		this.setState({inputValue: newValue!});
	};

	newTimeInputClickHandler = () => {
		let newTimes = [...this.props.times];

		newTimes.push(this.state.inputValue);
		
		this.props.onUpdate(newTimes);

		this.setState({inputValue: Date.now()});
	};
	
	createIdArr = memoizeOne(createIdArr);

	render() {
		let ids = this.createIdArr(this.props.times.length);

		let items = this.props.times.map((time, i) => 
			<li key={ids[i]} data-num={i} className={`${css.listItem} ${this.state.focusLiNum === i ? css.focus : ""}`}>
				<TimeInput value={time} onUpdate={(newValue: number | ITimeTerm | null) => this.timeInputUpdateHandler(i, newValue!)} />
				<button className={css.button} onClick={this.deleteTimeButtonClickHandler}>
					<img src={deleteIcon} />
				</button>
			</li>
		);
		
		return <ul className={css.timeListAddForm}>
			{items}
			<li data-num={items.length} className={`${css.listItem} ${css.newTimeInput} ${this.state.focusLiNum === items.length ? css.focus : ""}`}>
				<TimeInput value={this.state.inputValue} onUpdate={this.newTimeInputUpdateHandler} />
				<button className={css.button} onClick={this.newTimeInputClickHandler}>
					<img src={addIcon} />
				</button>
			</li>
		</ul>;
	}
}