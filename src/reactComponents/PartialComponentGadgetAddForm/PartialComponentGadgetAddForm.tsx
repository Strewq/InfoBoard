import React from "react"
import IGadget from "../../types/IGadget";

export type Props<T> = {
	add: (gadget: T & IGadget) => void
};

export type State = {
	name: string,
	tags: string[],
	isInvalid: boolean
};

export function addTags(this: React.Component<{}, State>, newTags: string[]) {
	this.setState({
		tags: newTags,
		isInvalid: false
	});
}

export function nameUpdateHandler(this: React.Component<{}, State>, newValue: string) {
	this.setState({
		name: newValue,
		isInvalid: false
	});
}

export function createDefaultState(): State {
	return {
		name: "",
		tags: [],
		isInvalid: false
	};
}