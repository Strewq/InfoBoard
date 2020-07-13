import React from "react";
import ReactDOM from "react-dom";
import ICore from "./types/ICore";
import Core from "./app/Core";
import IUiState from "./types/IUiState";
import UiState from "./ui/UiState";
import AppComponent from "./reactComponents/AppComponent/AppComponent";
import "./globalStyle.scss";

let core: ICore = new Core(window.localStorage, "items");

core.getItemsFromStorage();

let uiState: IUiState = new UiState(window.localStorage, "uiState");

uiState.getStateFromStorage();

ReactDOM.render(<AppComponent core={core} uiState={uiState} />, document.getElementById("root"));