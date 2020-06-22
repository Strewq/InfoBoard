import TimePartSetMode from "../../types/TimePartSetMode";

const strModeToTimePartSetModeMap = {
	transfer: TimePartSetMode.Transfer as const,
	close: TimePartSetMode.Close as const,
	limit: TimePartSetMode.Limit as const
};

export default strModeToTimePartSetModeMap;