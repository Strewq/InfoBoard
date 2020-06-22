import React from "react";
import createIdArr from "../../common/createIdArr";
import memoizeOne from "memoize-one";
import deleteIcon from "../../imgs/deleteIcon.svg";
import css from "./StringListAddForm.scss";

type Props = {
	strings: string[],
	onUpdate: (newStrings: string[]) => void
};

type State = {
	doNeedMoveFocus: boolean,
	focusLiNum: number | null
};

export default class StringListAddForm extends React.PureComponent<Props, State> {
	state = {
		doNeedMoveFocus: false,
		focusLiNum: null
	};

	ulRef: React.RefObject<HTMLUListElement> = React.createRef();

	componentDidUpdate() {
		if(this.state.doNeedMoveFocus) {
			let ul = this.ulRef.current!;
			let input = ul.children[ul.children.length - 2].querySelector("input")!;

			input.focus();

			this.setState({doNeedMoveFocus: false});
		}
	}

	stringInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newString = e.target.value;
		
		let newStrings = [...this.props.strings];

		newStrings[Number(e.target.parentElement!.dataset.num)] = newString;

		this.props.onUpdate(newStrings);
	};

	deleteStringButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let newStrings = [...this.props.strings];

		newStrings.splice(Number((e.target as HTMLButtonElement).parentElement!.dataset.num), 1);

		this.props.onUpdate(newStrings);
	};

	newStringInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newStrings = [...this.props.strings];

		newStrings.push(e.currentTarget.value);
		
		this.props.onUpdate(newStrings);

		this.setState({doNeedMoveFocus: true});
	};

	onFocus = (e: React.FocusEvent<HTMLElement>) => this.setState({focusLiNum: Number(e.target.parentElement!.dataset.num)});
	onBlur = () => this.setState({focusLiNum: null});
	
	createIdArr = memoizeOne(createIdArr);

	render() {
		let ids = this.createIdArr(this.props.strings.length);

		let items = this.props.strings.map((str, i) => 
			<li key={ids[i]} data-num={i} className={`${css.listItem} ${this.state.focusLiNum === i ? css.focus : ""}`}>
				<input type="text" value={str} className={css.input} onChange={this.stringInputChangeHandler} onFocus={this.onFocus} onBlur={this.onBlur} />
				<button className={css.button} onClick={this.deleteStringButtonClickHandler}>
					<img src={deleteIcon} />
				</button>
			</li>
		);
		
		return <ul ref={this.ulRef} className={css.stringListAddForm}>
			{items}
			<li data-num={items.length} className={`${css.listItem} ${this.state.focusLiNum === items.length ? css.focus : ""}`}>
				<input type="text" value={""} className={css.input} onChange={this.newStringInputChangeHandler} onFocus={this.onFocus} onBlur={this.onBlur} />
			</li>
		</ul>;
	}
}