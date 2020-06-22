import React from "react";
import ComparisonOperator from "../../types/ComparisonOperator";
import css from "./ComparisonOperatorSelect.scss";

export default function ComparisonOperatorSelect({value, onUpdate}: {value: ComparisonOperator, onUpdate: (newValue: ComparisonOperator) => void}) {
	let [isFocused, setIsFocused] = React.useState<boolean>(false);

	let comparisonOperatorChangeHandler = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => onUpdate(Number(e.target.value)), [onUpdate]);
	
	let onFocus = React.useCallback(() => setIsFocused(true), []);
	let onBlur = React.useCallback(() => setIsFocused(false), []);
	
	return <div className={`${css.comparisonOperatorSelect} ${isFocused ? css.focus : ""}`}>
		<select value={value} onChange={comparisonOperatorChangeHandler} onFocus={onFocus} onBlur={onBlur} className={css.select}>
			<option value={ComparisonOperator.EqualTo}>Equal To</option>
			<option value={ComparisonOperator.NotEqualTo}>Not Equal To</option>
			<option value={ComparisonOperator.GreaterThan}>Greater Than</option>
			<option value={ComparisonOperator.LessThan}>Less Than</option>
			<option value={ComparisonOperator.GreaterThanOrEqualTo}>Greater Than Or Equal To</option>
			<option value={ComparisonOperator.LessThanOrEqualTo}>Less Than Or Equal To</option>
		</select>
	</div>;
}