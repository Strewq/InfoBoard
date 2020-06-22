import React from "react";
import ICounterTask from "../../types/ICounterTask";
import IGadget from "../../types/IGadget";
import TimeState from "../TimeState/TimeState";
import UnorderedUniqueStringList from "../UnorderedUniqueStringList/UnorderedUniqueStringList";
import EventEmitter from "eventemitter3";
import ComparisonOperator from "../../types/ComparisonOperator";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import css from "../../commonStyles/commonGadgetComponent.scss";
import deleteButtonCss from "../../commonStyles/deleteButton.scss";
import tagListContainerCss from "../../commonStyles/tagListContainer.scss";
import checkboxContainerCss from "../../commonStyles/checkboxContainer.scss";
import infoCss from "./info.scss";
import counterTaskComponentCss from "./CounterTaskComponent.scss";

import equalToIcon from "../../imgs/equalToIcon.svg";
import notEqualTo from "../../imgs/notEqualToIcon.svg";
import greaterThan from "../../imgs/greaterThanIcon.svg";
import lessThan from "../../imgs/lessThanIcon.svg";
import greaterThanOrEqualTo from "../../imgs/greaterThanOrEqualToIcon.svg";
import lessThanOrEqualTo from "../../imgs/lessThanOrEqualToIcon.svg";
import addIcon from "../../imgs/addIcon.svg";
import minusIcon from "../../imgs/minusIcon.svg";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import MoveArrows from "../MoveArrows/MoveArrows";

const mapComparisonOperatorsToIconUrl = {
	[ComparisonOperator.EqualTo]: equalToIcon,
	[ComparisonOperator.NotEqualTo]: notEqualTo,
	[ComparisonOperator.GreaterThan]: greaterThan,
	[ComparisonOperator.LessThan]: lessThan,
	[ComparisonOperator.GreaterThanOrEqualTo]: greaterThanOrEqualTo,
	[ComparisonOperator.LessThanOrEqualTo]: lessThanOrEqualTo,
} as const;

type Props = {
	counterTask: ICounterTask & EventEmitter & IGadget,
	deleteCounterTask: (counterTask: ICounterTask & EventEmitter & IGadget) => void,
	counterTaskMap: IEventEmittingOrderedMap<string, IGadget>
};

export default class CounterTaskComponent extends React.PureComponent<Props> {
	componentDidMount() {
		this.init(this.props);
	}

	componentDidUpdate(prevProps: Props) {
		if(prevProps.counterTask !== this.props.counterTask || prevProps.deleteCounterTask !== this.props.deleteCounterTask) {
			this.deinit(prevProps);
			this.init(this.props);
		}
	}

	componentWillUnmount() {
		this.deinit(this.props);
	}

	init(props: Props) {
		props.counterTask.addListener("update", this.update, this);
	}

	deinit(props: Props) {
		props.counterTask.removeListener("update", this.update, this);
	}

	update = () => {
		this.forceUpdate();
	};

	deleteButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.deleteCounterTask(this.props.counterTask);
	};

	incrementButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.counterTask.increment();
	};

	decrementButtonClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		this.props.counterTask.decrement();
	};

	stubFunc() {}

	render() {
		let name = this.props.counterTask.name === "" ?
			<span className={`${css.flex} ${css.noData}`}>No name</span> :
			<span className={css.flex}>{this.props.counterTask.name}</span>
		;

		let tagList = this.props.counterTask.tags.length === 0 ?
			<span className={css.noData}>No Tags</span> :
			<UnorderedUniqueStringList strings={this.props.counterTask.tags} />
		;
		
		return <div className={`${css.commonGadgetComponent} ${counterTaskComponentCss.counterTaskComponent}`}>
			<MoveArrows map={this.props.counterTaskMap} mapKey={this.props.counterTask.uuid} />
			<div className={checkboxContainerCss.checkboxContainer}>
				<CustomCheckbox checked={this.props.counterTask.isCompleted} interactive={false} onUpdate={this.stubFunc} />
			</div>
			<div className={`${css.flex} ${infoCss.infoContainer}`}>
				<div className={infoCss.counter}>
					<button className={infoCss.changeButton} onClick={this.incrementButtonClickHandler}>
						<img src={addIcon} />
					</button>
					<span className={infoCss.actual}>{this.props.counterTask.actual}</span>
					<button className={infoCss.changeButton} onClick={this.decrementButtonClickHandler}>
						<img src={minusIcon} />
					</button>
				</div>
				<img className={`${infoCss.comparisonOperatorIcon} ${this.props.counterTask.isCompleted ? infoCss.isCompleted : ""}`} src={mapComparisonOperatorsToIconUrl[this.props.counterTask.comparisonOperator]} />
				<span className={infoCss.expected}>{this.props.counterTask.expected}</span>
			</div>
			{name}
			<div className={css.flex}>
				<TimeState timeLimits={this.props.counterTask.timeLimits} />
			</div>
			<div className={`${css.flex} ${tagListContainerCss.tagListContainer}`}>
				{tagList}
			</div>
			<button className={deleteButtonCss.deleteButton} onClick={this.deleteButtonClickHandler}>Delete</button>
		</div>;
	}
}