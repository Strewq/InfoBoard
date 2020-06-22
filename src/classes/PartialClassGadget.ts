import IGadget from "../types/IGadget";
import {v4 as uuidv4} from "uuid";
import CreatingError from "./CreatingError";
import UniquenessError from "./UniquenessError";

export interface ISerializedGadget {
	name: string;
	uuid: string;
	tags: readonly string[];
}

export interface IGadgetConstructorOptions {
	name?: string;
	uuid?: string;
	tags?: readonly string[];
}

export function assignPropsFromOptions(this: IGadget, options: IGadgetConstructorOptions) {
	(this.name as string) = options.name ?? "";
	(this.uuid as string) = options.uuid ?? uuidv4();

	let tags = [...(options.tags ?? [])];
	let tagSet: Set<string> = new Set();
	for(let tag of tags) {
		if(tagSet.has(tag)) {
			throw new CreatingError("All tags must be unique", new UniquenessError());
		}

		tagSet.add(tag);
	}
	(this.tags as string[]) = tags;
}

export function toJSON(this: IGadget): ISerializedGadget {
	let res: ISerializedGadget = <ISerializedGadget>{};

	res.name = this.name;
	res.uuid = this.uuid;
	res.tags = this.tags;
	
	return res;
}

export function createOptionObjFromPlainObj(plainObj: ISerializedGadget): IGadgetConstructorOptions {
	return {
		name: plainObj.name,
		uuid: plainObj.uuid,
		tags: plainObj.tags,
	};
}

export interface PropDeclarations {
	readonly name: string;
	readonly uuid: string;
	readonly tags: readonly string[];
}