export default class DragHandling {
	prevPageX: number = 0;
	prevPageY: number = 0;

	constructor(
		readonly elem: HTMLElement,
		readonly userDownHandler: (e: PointerEvent) => boolean,
		readonly userUpHandler: (e: PointerEvent) => void,
		readonly userMoveHandler: (e: PointerEvent, additionalProps: {movementX: number, movementY: number}) => void,
		readonly doAddStyle: boolean = false
	) {
		this.elem.addEventListener("pointerdown", this._downHandler);

		if(this.doAddStyle) {
			this.elem.style.touchAction = "none";
		}
	}

	stopHandling() {
		this.elem.removeEventListener("pointerdown", this._downHandler);

		if(this.doAddStyle) {
			this.elem.style.touchAction = "";
		}
	}

	private _downHandler = (e: PointerEvent) => {
		// userDownHandler must return a boolean value that
		// determines whether to start tracking or not
		if(!this.userDownHandler(e)) {
			return;
		}

		this.prevPageX = e.pageX;
		this.prevPageY = e.pageY;

		document.addEventListener("pointermove", this._moveHandler);
		document.addEventListener("pointerup", this._upHandler);
	}

	private _upHandler = (e: PointerEvent) => {
		document.removeEventListener("pointermove", this._moveHandler);
		document.removeEventListener("pointerup", this._upHandler);

		this.userUpHandler(e);
		
		this.prevPageX = 0;
		this.prevPageY = 0;
	};

	private _moveHandler = (e: PointerEvent) => {
		/*
		movementX/Y is rounded to an integer in Chrome for Android and often is zero, while pageX/Y is fractional
		Firefox doesn't support PointerEvent, so polyfill is used, but movementX/Y is undefided
		one needs to calculate movementX/Y by oneself
		*/

		let movementX = e.pageX - this.prevPageX;
		let movementY = e.pageY - this.prevPageY;

		this.userMoveHandler(e, {movementX, movementY});

		this.prevPageX = e.pageX;
		this.prevPageY = e.pageY;
	};
}