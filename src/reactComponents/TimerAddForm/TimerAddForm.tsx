import React from "react";
import * as PartialComponentGadgetAddForm from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";
import ITimer from "../../types/ITimer";
import createTimer from "../../common/createTimer";
import EventEmitter from "eventemitter3";
import ITimeTerm from "../../types/ITimeTerm";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import addButtonCss from "../../commonStyles/addButton.scss";
import TimeListAddForm from "../TimeListAddForm/TimeListAddForm";
import css from "../../commonStyles/gadgetAddForm.scss";

export type Props = PartialComponentGadgetAddForm.Props<ITimer & EventEmitter> & {};

type State = PartialComponentGadgetAddForm.State & {
	targetTimes: (number | ITimeTerm)[]
};

function createDefaultState() {
	let res: State = PartialComponentGadgetAddForm.createDefaultState() as State;

	res.targetTimes = [];
	
	return res;
}

export default class TimerAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentGadgetAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentGadgetAddForm.addTags.bind(this);

	targetTimeOnUpdate = (newValues: (number | ITimeTerm)[]) => {
		this.setState({
			targetTimes: newValues,
			isInvalid: false
		});
	};

	addCallback = () => {
		let timer = createTimer(this.state);
		
		if(timer === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(timer);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>Timer Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
			</div>
			<div>
				<span>Times</span>
				<TimeListAddForm times={this.state.targetTimes} onUpdate={this.targetTimeOnUpdate} />
			</div>
			<div>
				<span>Tags</span>
				<StringListAddForm strings={this.state.tags} onUpdate={this.addTags} />
			</div>
			<div>
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add Timer</button>
			</div>
		</div>;
	}
}