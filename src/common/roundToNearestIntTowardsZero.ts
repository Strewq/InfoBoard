export default function roundToNearestIntTowardsZero(num: number) {
	if(Math.abs(num % 1) === 0.5) {
		return Math.trunc(num);
	}
	else {
		return Math.round(num);
	}
}