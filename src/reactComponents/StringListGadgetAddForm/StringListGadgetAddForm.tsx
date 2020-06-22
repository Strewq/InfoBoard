import React from "react";
import * as PartialComponentGadgetAddForm from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";
import IStringList from "../../types/IStringList";
import EventEmitter from "eventemitter3";
import createStringList from "../../common/createStringList";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import css from "../../commonStyles/gadgetAddForm.scss";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import addButtonCss from "../../commonStyles/addButton.scss";

export type Props = PartialComponentGadgetAddForm.Props<IStringList & EventEmitter> & {};

type State = PartialComponentGadgetAddForm.State & {};

function createDefaultState() {
	let res: State = PartialComponentGadgetAddForm.createDefaultState();
	
	return res;
}

export default class StringListGadgetAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentGadgetAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentGadgetAddForm.addTags.bind(this);

	addCallback = () => {
		let stringList = createStringList(this.state);
		
		if(stringList === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(stringList);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>String List Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
			</div>
			<div>
				<span>Tags</span>
				<StringListAddForm strings={this.state.tags} onUpdate={this.addTags} />
			</div>
			<div>
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add String List</button>
			</div>
		</div>;
	}
}