import React from "react";
import * as PartialComponentTaskAddForm from "../PartialComponentTaskAddForm/PartialComponentTaskAddForm";
import IRegularTask from "../../types/IRegularTask";
import createRegularTask from "../../common/createRegularTask";
import EventEmitter from "eventemitter3";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import TimeInput from "../TimeInput/TimeInput";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import addButtonCss from "../../commonStyles/addButton.scss";
import css from "../../commonStyles/gadgetAddForm.scss";

export type Props = PartialComponentTaskAddForm.Props<IRegularTask & EventEmitter> & {};

type State = PartialComponentTaskAddForm.State & {};

function createDefaultState() {
	let res: State = PartialComponentTaskAddForm.createDefaultState(true, true);
	
	return res;
}

export default class RegularTaskAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentTaskAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentTaskAddForm.addTags.bind(this);
	startTimeUpdateHandler = PartialComponentTaskAddForm.startTimeUpdateHandler.bind(this);
	endTimeUpdateHandler = PartialComponentTaskAddForm.endTimeUpdateHandler.bind(this);

	addCallback = () => {
		let regularTask = createRegularTask(this.state.startTime, this.state.endTime, this.state);
		
		if(regularTask === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(regularTask);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>Regular Task Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
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
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add Regular Task</button>
			</div>
		</div>;
	}
}