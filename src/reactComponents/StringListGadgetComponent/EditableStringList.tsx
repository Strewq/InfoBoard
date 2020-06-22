import React from "react";
import css from "./EditableStringList.scss";
import deleteIcon from "../../imgs/deleteIcon.svg";
import upArrow from "../../imgs/upArrow.svg";
import downArrow from "../../imgs/downArrow.svg";

type Props = {
	strings: readonly string[],
	ids: readonly string[],
	addItem: (index: number, newString: string) => void,
	deleteItem: (index: number) => void,
	changeItem: (index: number, newString: string) => void,
	moveItem: (srcIndex: number, dstIndex: number) => void
};

type State = {
	doNeedMoveFocus: boolean,
	focusLiNum: number | null
};

/*
EditableStringList extends React.Component but not React.PureComponent, because when changing props.strings, the component cannot track changes
*/
export default class EditableStringList extends React.Component<Props, State> {
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
		let index = Number(e.target.parentElement!.dataset.num);
		
		let string = e.target.value;

		this.props.changeItem(index, string);
	};

	deleteStringButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let index = Number((e.target as HTMLButtonElement).parentElement!.dataset.num);
		
		this.props.deleteItem(index);
	};

	moveItemButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		let srcIndex = Number(e.currentTarget.parentElement!.parentElement!.dataset.num);
		let dstIndex = srcIndex + Number(e.currentTarget.dataset.shift);
		
		this.props.moveItem(srcIndex, dstIndex);
	};

	newStringInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		let index = this.props.strings.length;
		
		let newString = e.currentTarget.value;

		this.props.addItem(index, newString);

		this.setState({doNeedMoveFocus: true});
	};

	onFocus = (e: React.FocusEvent<HTMLElement>) => this.setState({focusLiNum: Number(e.target.parentElement!.dataset.num)});
	onBlur = () => this.setState({focusLiNum: null});
	
	render() {
		let ids = this.props.ids;

		let items = this.props.strings.map((str, i) => 
			<li key={ids[i]} data-num={i} className={`${css.listItem} ${this.state.focusLiNum === i ? css.focus : ""}`}>
				<input type="text" value={str} className={css.input} onChange={this.stringInputChangeHandler} onFocus={this.onFocus} onBlur={this.onBlur} />
				<div className={css.arrowContainer}>
					<button className={css.button} data-shift="-1" onClick={this.moveItemButtonClickHandler}>
						<img src={upArrow} />
					</button>
					<button className={css.button} data-shift="1" onClick={this.moveItemButtonClickHandler}>
						<img src={downArrow} />
					</button>
				</div>
				<button className={css.button} onClick={this.deleteStringButtonClickHandler}>
					<img src={deleteIcon} />
				</button>
			</li>
		);
		
		return <ul ref={this.ulRef} className={css.editableStringList}>
			{items}
			<li data-num={items.length} className={`${css.listItem} ${this.state.focusLiNum === items.length ? css.focus : ""}`}>
				<input type="text" value={""} className={css.input} onChange={this.newStringInputChangeHandler} onFocus={this.onFocus} onBlur={this.onBlur} />
			</li>
		</ul>;
	}
}