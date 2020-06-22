import IGadget from "../../types/IGadget";
import ITask from "../../types/ITask";
import * as PartialComponentGadgetAddForm from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";
import ITimeTerm from "../../types/ITimeTerm";

export type Props<T> = PartialComponentGadgetAddForm.Props<T> & {
	add: (task: T & ITask & IGadget) => void
};

export type State = PartialComponentGadgetAddForm.State & {
	startTime: number | ITimeTerm | null,
	endTime: number | ITimeTerm | null
};

export function createDefaultState(isCurTimeForStartTime = false, isCurTimeForEndTime = false) {
	let res: State = PartialComponentGadgetAddForm.createDefaultState() as State;

	res.startTime = isCurTimeForStartTime ? Date.now() : null;
	res.endTime = isCurTimeForEndTime ? Date.now() : null;
	
	return res;
}

export {
	addTags,
	nameUpdateHandler
} from "../PartialComponentGadgetAddForm/PartialComponentGadgetAddForm";

export function startTimeUpdateHandler(this: React.Component<{}, State>, value: number | ITimeTerm | null) {
	this.setState({
		startTime: value,
		isInvalid: false
	});
};

export function endTimeUpdateHandler(this: React.Component<{}, State>, value: number | ITimeTerm | null) {
	this.setState({
		endTime: value,
		isInvalid: false
	});
};