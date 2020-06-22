export default function applyMixins(target: any, bases: any[]) {
	for(let base of bases) {
		let basePrototypeDescriptors = Object.getOwnPropertyDescriptors(base.prototype);

		delete basePrototypeDescriptors.constructor;

		Object.defineProperties(target.prototype, basePrototypeDescriptors);
	}
}