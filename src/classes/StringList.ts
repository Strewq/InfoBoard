import EventEmitter from "eventemitter3";
import IStringList from "./../types/IStringList";
import IGadget from "../types/IGadget";
import {v4 as uuidv4} from "uuid";
import * as PartialClassGadget from "./PartialClassGadget";

export interface ISerializedStringList extends PartialClassGadget.ISerializedGadget {
	_type: "StringList",

	items: readonly string[],
	ids: readonly string[]
}

export interface IStringListConstructorOptions extends PartialClassGadget.IGadgetConstructorOptions {
	items?: readonly string[],
	ids?: readonly string[]
}

export default interface StringList extends PartialClassGadget.PropDeclarations {}
export default class StringList extends EventEmitter implements IStringList, IGadget {
	readonly items: readonly string[];
	readonly ids: readonly string[];

	constructor(options: IStringListConstructorOptions = {}) {
		super();

		PartialClassGadget.assignPropsFromOptions.call(this, options);

		this.items = options.items ? [...options.items] : [];
		this.ids = options.ids ? [...options.ids] : [...this.items.map(() => uuidv4())];
	}

	addItem(index: number, itemContent: string) {
		if(index > this.items.length || index < 0) {
			return;
		}
		
		(this.items as string[]).splice(index, 0, itemContent);
		(this.ids as string[]).splice(index, 0, uuidv4());

		this.emit("addItem", index);
		this.emit("update");
	}

	deleteItem(index: number) {
		if(index >= this.items.length || index < 0) {
			return;
		}
		
		(this.items as string[]).splice(index, 1);
		(this.ids as string[]).splice(index, 1);

		this.emit("deleteItem", index);
		this.emit("update");
	}

	changeItem(index: number, newItemContent: string) {
		if(index >= this.items.length || index < 0) {
			return;
		}
		
		let oldItemContent = this.items[index];
		
		(this.items as string[])[index] = newItemContent;

		this.emit("changeItem", oldItemContent, newItemContent);
		this.emit("update");
	}

	moveItem(srcIndex: number, dstIndex: number) {
		if(srcIndex >= this.items.length || srcIndex < 0) {
			return;
		}
		if(dstIndex >= this.items.length || dstIndex < 0) {
			return
		}
		
		let movedItem = (this.items as string[]).splice(srcIndex, 1)[0];
		(this.items as string[]).splice(dstIndex, 0, movedItem);

		let movedItemId = (this.ids as string[]).splice(srcIndex, 1)[0];
		(this.ids as string[]).splice(dstIndex, 0, movedItemId);

		this.emit("moveItem", srcIndex, dstIndex);
		this.emit("update");
	}

	static fromJSON(plainObj: ISerializedStringList) {
		return new StringList(
			{
				...PartialClassGadget.createOptionObjFromPlainObj(plainObj),
				
				items: plainObj.items,
				ids: plainObj.ids
			}
		);
	}

	toJSON(): ISerializedStringList {
		let res: ISerializedStringList = <ISerializedStringList>PartialClassGadget.toJSON.call(this);

		res._type = "StringList";

		res.items = this.items;
		res.ids = this.ids;

		return res;
	}
}