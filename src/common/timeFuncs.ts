import strftime from "strftime";

const dateTimeTemplate = "%Y-%m-%dT%H:%M:%S.%L";

export function timeNumToTimeStr(num: number | null) {
	return num ? strftime(dateTimeTemplate, new Date(num)) : "";
}