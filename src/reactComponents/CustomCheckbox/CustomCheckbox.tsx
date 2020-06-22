import React from "react";
import css from "./CustomCheckbox.scss";

type Props = {
	checked: boolean,
	onUpdate: (newValue: boolean) => void,
	interactive?: boolean
};

export default function CustomCheckbox({checked, onUpdate, interactive = true}: Props) {
	let onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => onUpdate(e.target.checked), [onUpdate]);
	
	return <div className={`${css.customCheckbox} ${interactive ? css.interactive : ""}`}>
		<input type="checkbox" checked={checked} className={css.checkbox} onChange={onChange} />
		<span className={css.border}></span>
		<span className={css.img}></span>
	</div>;
}