import IUiState from "../types/IUiState";

export default class UiState implements IUiState {
	theme: IUiState["theme"];
	
	private _storage: Storage;
	private _storageKey: string;

	constructor(storage: Storage, storageKey: string) {
		this._storage = storage;
		this._storageKey = storageKey;

		this.theme = "light"
	}

	getStateFromStorage() {
		let itemsStr = this._storage.getItem(this._storageKey);

		if(itemsStr === null) {
			return;
		}
		
		let items = JSON.parse(itemsStr);

		if(!(items instanceof Object)) {
			return;
		}

		if(typeof items.theme === "string") {
			this.theme = items.theme;
		}
	}

	sendStateToStorage() {
		this._storage.setItem(this._storageKey, JSON.stringify({
			theme: this.theme
		}));
	}
}