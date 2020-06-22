import React from "react";
import upArrow from "../../imgs/upArrow.svg";
import downArrow from "../../imgs/downArrow.svg";
import css from "./MoveArrows.scss";
import IEventEmittingOrderedMap from "../../types/IEventEmittingOrderedMap";
import IGadget from "../../types/IGadget";

type Props = {
	map: IEventEmittingOrderedMap<string, IGadget>
	mapKey: string
};

export default class MoveArrows extends React.PureComponent<Props> {
	moveItemButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let index = this.props.map.getIndexByKey(this.props.mapKey);
		let shift = Number(e.currentTarget.dataset.shift);

		this.props.map.moveItem(index, index + shift);
	};
	
	render() {
		return <div className={css.arrowContainer}>
			<button data-shift="-1" onClick={this.moveItemButtonClickHandler}>
				<img src={upArrow} />
			</button>
			<button data-shift="1" onClick={this.moveItemButtonClickHandler}>
				<img src={downArrow} />
			</button>
		</div>;
	}
}