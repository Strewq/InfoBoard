import React from "react";
import css from "./NumberInput.scss";

export default function NumberInput({value, onUpdate}: {value: number, onUpdate: (newValue: number) => void}) {
	let [isFocused, setIsFocused] = React.useState<boolean>(false);
	
	let onFocus = React.useCallback(() => setIsFocused(true), []);
	let onBlur = React.useCallback(() => setIsFocused(false), []);

	let onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate(Number(e.target.value)), [onUpdate]);
	
	return <div className={`${css.numberInputContainer} ${isFocused ? css.focus : ""}`}>
		<input type="number" value={value} className={css.numberInput} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
	</div>;
}