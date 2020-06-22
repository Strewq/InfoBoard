import React from "react";
import * as PartialComponentGadgetAddForm from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";
import IStopwatch from "../../types/IStopwatch";
import createStopwatch from "../../common/createStopwatch";
import EventEmitter from "eventemitter3";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import addButtonCss from "../../commonStyles/addButton.scss";
import css from "../../commonStyles/gadgetAddForm.scss";

export type Props = PartialComponentGadgetAddForm.Props<IStopwatch & EventEmitter> & {};

type State = PartialComponentGadgetAddForm.State & {};

function createDefaultState() {
	let res: State = PartialComponentGadgetAddForm.createDefaultState();
	
	return res;
}

export default class StopwatchAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentGadgetAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentGadgetAddForm.addTags.bind(this);

	addCallback = () => {
		let stopwatch = createStopwatch(this.state);
		
		if(stopwatch === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(stopwatch);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>Stopwatch Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
			</div>
			<div>
				<span>Tags</span>
				<StringListAddForm strings={this.state.tags} onUpdate={this.addTags} />
			</div>
			<div>
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add Stopwatch</button>
			</div>
		</div>;
	}
}