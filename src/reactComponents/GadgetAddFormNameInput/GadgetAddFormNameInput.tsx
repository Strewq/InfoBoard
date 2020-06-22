import React from "react";
import css from "./GadgetAddFormNameInput.scss";

export default function GadgetAddFormNameInput({value, onUpdate}: {value: string, onUpdate: (newValue: string) => void}) {
	let [isFocused, setIsFocused] = React.useState<boolean>(false);
	
	let nameChangeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate(e.target.value), [onUpdate]);
	let onFocus = React.useCallback(() => setIsFocused(true), []);
	let onBlur = React.useCallback(() => setIsFocused(false), []);
	
	return <div className={`${css.nameInputContainer} ${isFocused ? css.focus : ""}`}>
		<input
			type="text"
			value={value}
			onChange={nameChangeHandler}
			onFocus={onFocus}
			onBlur={onBlur}
			className={css.nameInput}
		/>
	</div>;
}