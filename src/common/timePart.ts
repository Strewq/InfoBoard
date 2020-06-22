import {Interval} from "@strewq/intervalLib";

const maxNumOfDaysInMonth = 100;

export const timePartNameArr = [
	"y",
	"mo",
	"d",
	"h",
	"m",
	"s",
	"ms"
] as const;

export const transferNumOf = {
	ms: 1000,
	s: 60,
	m: 60,
	h: 24,
	d: maxNumOfDaysInMonth,
	mo: 12
} as const;

export const unitsIn = {
	s: transferNumOf.ms,
	m: transferNumOf.s,
	h: transferNumOf.m,
	d: transferNumOf.h,
	y: transferNumOf.mo
} as const;

export const msIn: {
	ms: number,
	s: number,
	m: number,
	h: number,
	d: number,
} = <any>{};
msIn.ms = 1;
msIn.s = msIn.ms * unitsIn.s;
msIn.m = msIn.s * unitsIn.m;
msIn.h = msIn.m * unitsIn.h;
msIn.d = msIn.h * unitsIn.d;

const commonCloseIntervals = {
	mo: new Interval(0, transferNumOf.mo, true, false),
	h: new Interval(0, transferNumOf.h, true, false),
	m: new Interval(0, transferNumOf.m, true, false),
	s: new Interval(0, transferNumOf.s, true, false),
	ms: new Interval(0, transferNumOf.ms, true, false),
} as const;

const commonLimitIntervals = {
	mo: new Interval(0, transferNumOf.mo - 1),
	h: new Interval(0, transferNumOf.h - 1),
	m: new Interval(0, transferNumOf.m - 1),
	s: new Interval(0, transferNumOf.s - 1),
	ms: new Interval(0, transferNumOf.ms - 1),
} as const;

export const timeTermCloseIntervals = {
	...commonCloseIntervals,
	d: new Interval(0, transferNumOf.d, true, false)
} as const;

export const timeTermLimitIntervals = {
	...commonLimitIntervals,
	y: new Interval(0, Infinity),
	d: new Interval(0, transferNumOf.d - 1)
} as const;

export const uDateCloseIntervals = {
	...commonCloseIntervals,
	y: new Interval(-Infinity, Infinity, true, true)
} as const;

export const uDateLimitIntervals = {
	...commonLimitIntervals,
	y: new Interval(-Infinity, Infinity)
} as const;

export const dayCloseIntervals = {
	28: new Interval(0, 28, true, false),
	29: new Interval(0, 29, true, false),
	30: new Interval(0, 30, true, false),
	31: new Interval(0, 31, true, false),
} as const;

export const dayLimitIntervals = {
	28: new Interval(1, 28),
	29: new Interval(1, 29),
	30: new Interval(1, 30),
	31: new Interval(1, 31),
} as const;

const daysInMonth = [
	31,
	null,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
] as const;

export function getNumOfDaysInMonth(y: number, m: number): 28 | 29 | 30 | 31 | undefined {
	if(m === 1) {
		return new Date(y, 2, 0).getDate() as any;
	}
	else {
		return daysInMonth[m]!;
	}
}