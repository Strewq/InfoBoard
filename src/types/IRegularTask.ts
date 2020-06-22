import ITask from "./ITask";

export default interface IRegularTask extends ITask {
	complete(): void,
	uncomplete(): void,
	toggle(): boolean
}