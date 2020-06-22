import React from "react";
import css from "./MessageInput.scss";

export default function MessageInput({value, onUpdate}: {value: string, onUpdate: (newValue: string) => void}) {
	let [isFocused, setIsFocused] = React.useState<boolean>(false);
	
	let nameChangeHandler = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(e.target.value), [onUpdate]);
	let onFocus = React.useCallback(() => setIsFocused(true), []);
	let onBlur = React.useCallback(() => setIsFocused(false), []);
	
	return <div className={`${css.nameInputContainer} ${isFocused ? css.focus : ""}`}>
		<textarea
			value={value}
			onChange={nameChangeHandler}
			onFocus={onFocus}
			onBlur={onBlur}
			className={css.nameInput}
		/>
	</div>;
}