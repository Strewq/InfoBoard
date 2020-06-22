const maxTimeout = 2 ** 31 - 1;

type IClearerInternal = {
	currentId: number
};

export type IClearer = {
	clear(): void
};

export default function setTimer(timeout: number, handler: Function, thisArg: any = undefined, ...args: any[]): IClearer {
	let clearer: IClearer & IClearerInternal = <any>{
		clear() {
			clearInterval(this.currentId);
		}
	};
	
	function defer(timeout: number) {
		if(timeout > maxTimeout) {
			clearer.currentId = setTimeout(() => defer(timeout - maxTimeout), maxTimeout);
		}
		else {
			clearer.currentId = setTimeout(handler.bind(thisArg), timeout, ...args);
		}
	}

	defer(timeout);

	return clearer;
}