import React from "react";
import IMessage from "../../types/IMessage"
import IGadget from "../../types/IGadget";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import messageCss from "./message.scss";
import messageComponentCss from "./MessageComponent.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";

import MoveArrows from "../MoveArrows/MoveArrows";

type Props = {
	message: IMessage & IGadget,
	deleteMessage: (message: IMessage & IGadget) => void,
	messageMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class MessageComponent extends React.PureComponent<Props> {
	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteMessage(this.props.message);
	};
	
	render() {
		let name = this.props.message.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.message.name}</span>
		;

		let message = this.props.message.message === "" ?
			<span className={`${css.flex} ${css.noData}`}>No message</span> :
			<span className={`${css.flex} ${messageCss.message}`}>{this.props.message.message}</span>
		;

		let tagList = this.props.message.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.message.tags} />
		;
		
		return <div className={`${css.commonGadgetComponent} ${messageComponentCss.messageComponent}`}>
			<MoveArrows map={this.props.messageMap} mapKey={this.props.message.uuid} />
			{name}
			{message}
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}