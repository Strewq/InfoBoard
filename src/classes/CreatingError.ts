export default class CreatingError extends Error {
	name = "CreatingError";
	cause: Error | null;

	constructor(message?: string, cause: Error | null = null) {
		super(message);

		this.cause = cause;
	}
}