/* eslint-disable no-shadow */
/* eslint-disable brace-style */
import { reduce, last, filter, map } from "../collections/iterable"
import { Projector } from "../functional"
import { Tuple } from "../utility"

export function min<T>(collection: Iterable<number>): number | undefined
export function min<T>(collection: Iterable<T>, projector: Projector<T, number, number>): T | undefined
export function min(collection: Iterable<unknown>, projector?: Projector<unknown, number, number>): unknown | undefined {
	return last(reduce(
		(projector ? map(collection, projector) : collection) as Iterable<number>,
		undefined as number | undefined,
		(prev, curr) => (prev === undefined || curr < prev) ? curr : prev
	))
}

export function max<T>(collection: Iterable<number>): number | undefined
export function max<T>(collection: Iterable<T>, projector: Projector<T, number, number>): T | undefined
export function max(collection: Iterable<unknown>, projector?: Projector<unknown, number, number>): unknown | undefined {
	return last(reduce(
		(projector ? map(collection, projector) : collection) as Iterable<number>,
		undefined as number | undefined,
		(prev, curr) => (prev === undefined || curr > prev) ? curr : prev
	))
}

export function sum(collection: Array<number>) { return last(reduce(collection, 0, (x, y) => x + y)) || 0 }

export function mean(collection: Array<number>): number {
	if (collection.length === 0)
		throw new Error(`Cannot calculate mean of empty array`)
	return sum(collection) / collection.length
}

export function variance(collection: Array<number>, collectionMean?: number /*optional already calculated mean */): number | undefined {
	if (collection.length === 1)
		return 0

	const _mean = collectionMean || mean(collection)
	if (_mean === undefined)
		return undefined

	return sum(collection.map(datum => Math.pow(datum - _mean, 2))) / (collection.length)
}

export function deviation(collection: Array<number>): number | undefined {
	const _variance = variance(collection, mean(collection))
	return _variance ? Math.sqrt(_variance) : undefined
}

export function median(collection: Array<number>): number | undefined {
	// eslint-disable-next-line fp/no-mutating-methods
	const _ordered = collection.sort()
	if (_ordered.length % 2 === 1) {
		return _ordered[Math.floor(collection.length / 2)]
	}
	else {
		// eslint-disable-next-line no-shadow, @typescript-eslint/no-non-null-assertion
		const first = _ordered[Math.floor(_ordered.length / 2) - 1]
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const second = _ordered[Math.floor(_ordered.length / 2)]
		return (first + second) / 2
	}
}

export function interQuartileRange(collection: Array<number>) {
	// eslint-disable-next-line fp/no-mutating-methods
	const sortedList = collection.sort()
	const percentile25 = sortedList[Math.floor(0.25 * sortedList.length)]
	const percentile75 = sortedList[Math.ceil(0.75 * sortedList.length)]
	return percentile25 && percentile75 ? percentile75 - percentile25 : undefined
}

export function frequencies<T>(items: Iterable<T>): globalThis.Map<T, number> {
	const freqs = new globalThis.Map<T, number>(); //semi-colon required at end of this statement
	// eslint-disable-next-line fp/no-unused-expression
	[...items].forEach(item => {
		// eslint-disable-next-line fp/no-unused-expression
		freqs.set(item, (freqs.get(item) || 0) + 1)
	})
	return freqs
}

export function frequenciesPercentScaled<T>(items: Iterable<T>): globalThis.Map<T, number> {
	return new globalThis.Map(map(frequencies(items), freq => new Tuple(freq[0], freq[1] * 100 / [...items].length)))
}

export function frequency<T>(items: Iterable<T>, item: T): number {
	return [...filter(items, _item => _item === item)].length
}