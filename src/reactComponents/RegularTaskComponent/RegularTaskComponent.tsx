import React from "react";
import IRegularTask from "../../types/IRegularTask"
import IGadget from "../../types/IGadget";
import EventEmitter from "eventemitter3";
import TimeState from "../TimeState/TimeState";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import checkboxContainerCss from "../../commonStyles/checkboxContainer.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import regularTaskComponentCss from "./RegularTaskComponent.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import MoveArrows from "../MoveArrows/MoveArrows";

type Props = {
	regularTask: IRegularTask & EventEmitter & IGadget,
	deleteRegularTask: (regularTask: IRegularTask & EventEmitter & IGadget) => void,
	regularTaskMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class RegularTaskComponent extends React.PureComponent<Props> {
	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.regularTask !== this.props.regularTask || prevProps.deleteRegularTask !== this.props.deleteRegularTask) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.regularTask.addListener("update", this.update, this);
	}

	deinit(props: Props) {
		props.regularTask.removeListener("update", this.update, this);
	}

	update = () => {
		this.forceUpdate();
	};

	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteRegularTask(this.props.regularTask);
	};

	toogleIsCompleted = () => {
		this.props.regularTask.toggle();
	};

	render() {
		let name = this.props.regularTask.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.regularTask.name}</span>
		;

		let tagList = this.props.regularTask.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.regularTask.tags} />
		;
		
		return <div className={`${css.commonGadgetComponent} ${regularTaskComponentCss.regularTaskComponent}`}>
			<MoveArrows map={this.props.regularTaskMap} mapKey={this.props.regularTask.uuid} />
			<div className={checkboxContainerCss.checkboxContainer}>
				<CustomCheckbox checked={this.props.regularTask.isCompleted} onUpdate={this.toogleIsCompleted} />
			</div>
			{name}
			<div className={css.flex}>
				<TimeState timeLimits={this.props.regularTask.timeLimits} />
			</div>
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}