import React from "react";
import roundToNearestIntTowardsZero from "../../common/roundToNearestIntTowardsZero";
import scaleNumByEventWithKeys from "../../common/scaleNumByEventWithKeys";
import DragHandling from "../../common/DragHandling";
import WheelHandling from "../../common/WheelHandling";
import css from "./ScrollableInput.scss";

type Props = {
	values: {
		prev: string,
		cur: string,
		next: string
	},
	onUpdate: (indexShift: number) => void,
	doubleClickHandler?: () => void
};

export default class ScrollableInput extends React.PureComponent<Props> {
	shiftY: number = 0;
	isBeingDragged: boolean = false;
	scrollableElemRef: React.RefObject<HTMLSpanElement> = React.createRef();
	dragHandling!: DragHandling;
	wheelHandling!: WheelHandling;

	componentDidMount() {
		let scrollableElem = this.scrollableElemRef.current!;
		
		this.dragHandling = new DragHandling(
			scrollableElem,
			this.pointerDownHandler,
			this.pointerUpHandler,
			this.pointerMoveHandler
		);
		this.wheelHandling = new WheelHandling(
			scrollableElem,
			this.wheelHandler,
			true
		);
		scrollableElem.addEventListener("pointerleave", this.pointerLeaveHandler);
		scrollableElem.addEventListener("dblclick", this.dblclickHandler);
	}

	componentWillUnmount() {
		let scrollableElem = this.scrollableElemRef.current!;
		
		this.dragHandling.stopHandling();
		this.wheelHandling.stopHandling();
		scrollableElem.removeEventListener("pointerleave", this.pointerLeaveHandler);
		scrollableElem.removeEventListener("dblclick", this.dblclickHandler);
	}

	setshiftY(newValue: number) {
		this.shiftY = newValue;

		if(Math.abs(this.shiftY) > 0.5) {
			let indexShift = roundToNearestIntTowardsZero(this.shiftY);

			let a = this.shiftY % 1;
			this.shiftY = a + -1 * Math.sign(a);
			
			this.props.onUpdate(indexShift);
		}

		this.scrollableElemRef.current!.style.top = this.shiftY + "em";
	}

	wheelHandler = (e: WheelEvent) => {
		if(e.deltaY === 0) {
			return;
		}

		this.setshiftY(this.shiftY + scaleNumByEventWithKeys(-Math.sign(e.deltaY), e));
	};

	dblclickHandler = () => {
		this.props.doubleClickHandler?.();
	};

	pointerDownHandler = (e: PointerEvent) => {
		if(e.buttons !== 1) {
			return false;
		}

		this.isBeingDragged = true;		
		return true;
	};

	pointerUpHandler = () => {
		this.setshiftY(0);
		this.isBeingDragged = false;
	};

	pointerMoveHandler = (e: PointerEvent, {movementY}: {movementY: number}) => {
		if(movementY === 0) {
			return;
		}

		this.setshiftY(this.shiftY + scaleNumByEventWithKeys(movementY / (Number.parseInt(getComputedStyle(this.scrollableElemRef.current!).fontSize, 10)), e));
	};

	pointerLeaveHandler = () => {
		if(!this.isBeingDragged && this.shiftY !== 0) {
			this.setshiftY(0);
		}
	};
	
	render() {
		return <span className={css.container}>
			<span ref={this.scrollableElemRef} className={css.scrollable}>
				<span>{this.props.values.next}</span>
				<span>{this.props.values.cur}</span>
				<span>{this.props.values.prev}</span>
			</span>
		</span>;
	}
}