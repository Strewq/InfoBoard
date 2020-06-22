export default interface IStringList {
	readonly items: readonly string[];
	readonly ids: readonly string[];

	addItem(index: number, itemContent: string): void;
	deleteItem(index: number): void;
	changeItem(index: number, newItemContent: string): void;
	moveItem(srcIndex: number, dstIndex: number): void;
}