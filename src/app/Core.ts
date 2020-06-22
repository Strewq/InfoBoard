import EventEmittingOrderedMap from "../classes/EventEmittingOrderedMap";
import getCoreReviver from "./getCoreReviver";
import ICore from "../types/ICore";
import EventEmitter from "eventemitter3";

export default class Core implements ICore {
	static containerNames = [
		"stringLists",
		"messages",
		"regularTasks",
		"counterTasks",
		"timers",
		"stopwatches"
	] as const;

	regularTasks: ICore["regularTasks"];
	counterTasks: ICore["counterTasks"];
	stringLists: ICore["stringLists"];
	messages: ICore["messages"];
	timers: ICore["timers"];
	stopwatches: ICore["stopwatches"];

	private _storage: Storage;
	private _storageKey: string;

	private _coreReviver = getCoreReviver();

	constructor(storage: Storage, storageKey: string) {
		this._storage = storage;
		this._storageKey = storageKey;

		this.regularTasks = new EventEmittingOrderedMap();
		this.counterTasks = new EventEmittingOrderedMap();
		this.stringLists = new EventEmittingOrderedMap();
		this.messages = new EventEmittingOrderedMap();
		this.timers = new EventEmittingOrderedMap();
		this.stopwatches = new EventEmittingOrderedMap();

		for(let containerName of Core.containerNames) {
			let container = this[containerName];

			(container.addListener as (event: string, fn: () => void) => void)("update", () => {
				this.sendItemsToStorage();
			});
			
			(container.addListener as (event: string, fn: (key: string) => void) => void)("setItem", (key: string) => {
				let item = container.get(key)!;

				if("addListener" in item) {
					(item as EventEmitter).addListener("update", this.sendItemsToStorage, this);
				}
			});

			(container.addListener as (type: string, fn: (deletedValue: any) => void) => void)("deleteItem", (deletedValue: any) => {
				if("removeListener" in deletedValue) {
					deletedValue.removeListener("update", this.sendItemsToStorage, this);
				}
			});
		}
	}

	private _checkRevivedJson(revivedJson: any) {
		if(!(revivedJson instanceof Object)) {
			return false;
		}

		for(let containerName of Core.containerNames) {
			let revivedContainer = revivedJson[containerName];

			if(!(revivedContainer instanceof EventEmittingOrderedMap)) {
				return false;
			}
		}

		return true;
	}

	getItemsFromStorage() {
		let itemsStr = this._storage.getItem(this._storageKey);

		if(itemsStr === null) {
			return;
		}
		
		let items = this._coreReviver.revive(itemsStr);

		if(this._checkRevivedJson(items)) {
			for(let containerName of Core.containerNames) {
				let revivedContainer = items[containerName];

				this[containerName].reset(revivedContainer.entries(), revivedContainer.order);
			}
		}
	}

	sendItemsToStorage() {
		this._storage.setItem(this._storageKey, JSON.stringify({
			stringLists: this.stringLists,
			messages: this.messages,
			regularTasks: this.regularTasks,
			counterTasks: this.counterTasks,
			timers: this.timers,
			stopwatches: this.stopwatches,
		}));
	}

	saveStateToFile() {
		let blob = new Blob([this._storage.getItem(this._storageKey) ?? ""], {type: "application/json"});

		download(blob, "state.json");
	}

	async loadStateFromFile() {
		let file = await upload();

		let text = await new Promise<string>((res, rej) => {
			let fileReader = new FileReader();
			
			fileReader.readAsText(file);

			fileReader.onload = () => res(fileReader.result as string);
			fileReader.onerror = () => rej(fileReader.error);
		});
		
		let items = this._coreReviver.revive(text);

		if(this._checkRevivedJson(items)) {
			for(let containerName of Core.containerNames) {
				let revivedContainer = items[containerName];

				this[containerName].reset(revivedContainer.entries(), revivedContainer.order);
			}
		}
	}
}

function upload() {
	return new Promise<File>((res, rej) => {
		let input = document.createElement("input");
		input.type = "file";

		function changeHandler() {
			res(input.files![0]);
		}
		
		input.addEventListener("change", changeHandler, {once: true});
		
		input.click();
	});
}

function download(blob: Blob, filename: string) {
	let objUrl = URL.createObjectURL(blob);

	let a = document.createElement("a");
	a.download = filename;
	a.href = objUrl;

	a.click();

	URL.revokeObjectURL(objUrl);
}