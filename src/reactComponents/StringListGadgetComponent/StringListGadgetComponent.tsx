import React from "react";
import IStringList from "../../types/IStringList"
import IGadget from "../../types/IGadget";
import EventEmitter from "eventemitter3";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import memoizeOne from "memoize-one";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import EditableStringList from "./EditableStringList";
import stringListGadgetComponentCss from "./StringListGadgetComponent.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import MoveArrows from "../MoveArrows/MoveArrows";

function getBindedFuncs(stringList: Props["stringList"]) {
	return {
		addItem: stringList.addItem.bind(stringList),
		deleteItem: stringList.deleteItem.bind(stringList),
		changeItem: stringList.changeItem.bind(stringList),
		moveItem: stringList.moveItem.bind(stringList),
	};
}

type Props = {
	stringList: IStringList & EventEmitter & IGadget,
	deleteStringListGadget: (stringList: IStringList & EventEmitter & IGadget) => void,
	stringListGadgetMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class StringListGadgetComponent extends React.PureComponent<Props> {
	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.stringList !== this.props.stringList || prevProps.deleteStringListGadget !== this.props.deleteStringListGadget) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.stringList.addListener("update", this.update, this);
	}

	deinit(props: Props) {
		props.stringList.removeListener("update", this.update, this);
	}

	update = () => {
		this.forceUpdate();
	};

	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteStringListGadget(this.props.stringList);
	};

	getBindedFuncs = memoizeOne(getBindedFuncs);

	render() {
		let {
			addItem,
			deleteItem,
			changeItem,
			moveItem
		} = this.getBindedFuncs(this.props.stringList);
		
		let name = this.props.stringList.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.stringList.name}</span>
		;

		let tagList = this.props.stringList.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.stringList.tags} />
		;

		return <div className={`${css.commonGadgetComponent} ${stringListGadgetComponentCss.stringListGadgetComponent}`}>
			<MoveArrows map={this.props.stringListGadgetMap} mapKey={this.props.stringList.uuid} />
			{name}
			<div className={css.flex}>
				<EditableStringList
					strings={this.props.stringList.items}
					ids={this.props.stringList.ids}
					addItem={addItem}
					deleteItem={deleteItem}
					changeItem={changeItem}
					moveItem={moveItem}
				/>
			</div>
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}