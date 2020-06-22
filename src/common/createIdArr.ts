import {v4 as uuidv4} from "uuid";

export default function createIdArr(length: number) {
	let res: string[] = [];
	for(let i = 0; i < length; ++i) {
		res[i] = uuidv4();
	}
	return res;
}