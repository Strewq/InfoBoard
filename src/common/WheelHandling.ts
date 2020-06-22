// the objects of Element interface can emit WheelEvent (https://developer.mozilla.org/en-US/docs/Web/API/Element#Events),
// but ElementEventMap in lib.dom.d.ts does not have the required events
// so type assertions is used when adding event handlers to this.elem
export default class WheelHandling {
	constructor(
		readonly elem: Element,
		readonly userHandler: (e: WheelEvent) => void,
		readonly doBlockScrolling: boolean
	) {
		this.elem.addEventListener("wheel", this.handler as (e: Event) => void, {passive: !this.doBlockScrolling});
	}

	stopHandling() {
		this.elem.removeEventListener("wheel", this.handler as (e: Event) => void);
	}

	handler = (e: WheelEvent) => {
		if(this.doBlockScrolling) {
			e.preventDefault();
		}

		this.userHandler(e);
	};
}