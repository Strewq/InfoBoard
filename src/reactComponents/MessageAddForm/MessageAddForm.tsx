import React from "react";
import * as PartialComponentGadgetAddForm from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";
import IMessage from "../../types/IMessage";
import createMessage from "../../common/createMessage";
import StringListAddForm from "../StringListAddForm/StringListAddForm";
import GadgetAddFormNameInput from "../GadgetAddFormNameInput/GadgetAddFormNameInput";
import addButtonCss from "../../commonStyles/addButton.scss";
import MessageInput from "./MessageInput";
import css from "../../commonStyles/gadgetAddForm.scss";

export type Props = PartialComponentGadgetAddForm.Props<IMessage> & {};

type State = PartialComponentGadgetAddForm.State & {
	message: string
};

function createDefaultState() {
	let res: State = PartialComponentGadgetAddForm.createDefaultState() as State;

	res.message = "";
	
	return res;
}

export default class MessageAddForm extends React.PureComponent<Props, State> {
	state: State = createDefaultState();
	
	nameUpdateHandler = PartialComponentGadgetAddForm.nameUpdateHandler.bind(this);
	addTags = PartialComponentGadgetAddForm.addTags.bind(this);

	messageUpdateHandler = (newValue: string) => {
		this.setState({
			message: newValue,
			isInvalid: false
		});
	};

	addCallback = () => {
		let message = createMessage(this.state);
		
		if(message === false) {
			this.setState({
				isInvalid: true
			});
	
			return;
		}
	
		this.props.add(message);
	
		this.setState(createDefaultState());
	};
	
	render() {
		return <div className={`${css.gadgetAddForm} ${this.state.isInvalid ? css.invalidForm : ""}`}>
			<span className={css.header}>Message Add Form</span>
			<div>
				<span>Name</span>
				<GadgetAddFormNameInput value={this.state.name} onUpdate={this.nameUpdateHandler} />
			</div>
			<div>
				<span>Message</span>
				<MessageInput value={this.state.message} onUpdate={this.messageUpdateHandler} />
			</div>
			<div>
				<span>Tags</span>
				<StringListAddForm strings={this.state.tags} onUpdate={this.addTags} />
			</div>
			<div>
				<button onClick={this.addCallback} className={addButtonCss.addButton}>Add Message</button>
			</div>
		</div>;
	}
}