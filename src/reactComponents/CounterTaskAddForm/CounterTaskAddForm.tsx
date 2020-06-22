import React from "react";
import * as PartialComponentTaskAddForm from "../PartialComponentTaskAddForm/PartialComponentTaskAddForm";
import ICounterTask from "../../types/ICounterTask";
import createCounterTask from "../../common/createCounterTask";
import ComparisonOperator from "../../types/ComparisonOperator";
import EventEmitter from "eventemitter3";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import css from "../../commonStyles/gadgetAddForm.scss";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import TimeInput from "../TimeInput/TimeInput";
import addButtonCss from "../../commonStyles/addButton.scss";
import ComparisonOperatorSelect from "../ComparisonOperatorSelect/ComparisonOperatorSelect";
import NumberInput from "../NumberInput/NumberInput";

export type Props = PartialComponentTaskAddForm.Props<ICounterTask & EventEmitter> & {};

type State = PartialComponentTaskAddForm.State & {
	expected: number,
	comparisonOperator: ComparisonOperator
};

function createDefaultState() {
	let res: State = PartialComponentTaskAddForm.createDefaultState(true, true) as State;

	res.expected = 0;
	res.comparisonOperator = ComparisonOperator.EqualTo;
	
	return res;
}

export default class CounterTaskAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentTaskAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentTaskAddForm.addTags.bind(this);
	startTimeUpdateHandler = PartialComponentTaskAddForm.startTimeUpdateHandler.bind(this);
	endTimeUpdateHandler = PartialComponentTaskAddForm.endTimeUpdateHandler.bind(this);

	expectedUpdateHandler = (newValue: number) => {
		this.setState({
			expected: newValue,
			isInvalid: false
		});
	};

	comparisonOperatorUpdateHandler = (value: ComparisonOperator) => {
		this.setState({
			comparisonOperator: value,
			isInvalid: false
		});
	};

	addCallback = () => {
		let counterTask = createCounterTask(this.state.startTime, this.state.endTime, this.state);
		
		if(counterTask === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(counterTask);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>Counter Task Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
			</div>
			<div>
				<span>Expected Number</span>
				<NumberInput value={this.state.expected} onUpdate={this.expectedUpdateHandler} />
			</div>
			<div>
				<span>Conparison Operator</span>
				<ComparisonOperatorSelect value={this.state.comparisonOperator} onUpdate={this.comparisonOperatorUpdateHandler} />
			</div>
			<div>
				<span>Start Time</span>
				<TimeInput value={this.state.startTime} onUpdate={this.startTimeUpdateHandler} withNullButton />
			</div>
			<div>
				<span>End Time</span>
				<TimeInput value={this.state.endTime} onUpdate={this.endTimeUpdateHandler} withNullButton />
			</div>
			<div>
				<span>Tags</span>
				<StringListAddForm strings={this.state.tags} onUpdate={this.addTags} />
			</div>
			<div>
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add Counter Task</button>
			</div>
		</div>;
	}
}