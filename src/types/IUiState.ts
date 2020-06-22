type Theme = "light" | "dark";

export default interface IUiState {
	theme: Theme;
	
	getStateFromStorage(): void;
	sendStateToStorage(): void;
}