/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable fp/no-rest-parameters */
/* eslint-disable brace-style */
import { } from "../utility"

/** Return -1 if a is smaller than b; 0 if a & b are equal, and 1 if a is bigger than b */
export type Ranker<X = unknown> = (a: X, b: X) => number
export type RankerAsync<X = unknown> = (a: X, b: X) => Promise<number>

/** Return true if a and b are equal, otherwise returns false */
export type Comparer<X = unknown> = (a: X, b: X) => boolean
export type ComparerAsync<X = unknown> = (a: X, b: X) => Promise<boolean>

/** Computes a unique hash */
export type Hasher<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Y
export type HasherAsync<X = unknown, Y extends string | number | symbol = number> = (a?: X) => Promise<Y>

export type Projector<X = unknown, Y = unknown, I = number> = (value: X, index: I) => Y
export type ProjectorAsync<X = unknown, Y = unknown, I = unknown> = (item: X, index: I) => Y | Promise<Y>

export type Predicate<X = unknown, I = number> = (value: X, index: I) => boolean
export type PredicateAsync<X = unknown, I = unknown> = (value: X, index: I) => Promise<boolean>

export type Reducer<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Y
export type ReducerAsync<X = unknown, Y = unknown, I = unknown> = (prev: Y, current: X, index: I) => Promise<Y>


export function compare<T>(x: T, y: T, comparer?: Projector<T, unknown, void>, tryNumeric = false): number {
	// eslint-disable-next-line fp/no-let
	let _x: unknown = comparer ? comparer(x) : x
	// eslint-disable-next-line fp/no-let
	let _y: unknown = comparer ? comparer(y) : y

	if (typeof _x === "string" && typeof _y === "string") {

		if (tryNumeric === true) {
			const __x = parseFloat(_x)
			const __y = parseFloat(_y)
			if ((!Number.isNaN(__x)) && (!Number.isNaN(__y))) {
				return __x - __y
			}
		}

		return new Intl.Collator().compare(_x || "", _y || "")
	}
	else if (typeof _x === "number" && typeof _y === "number") {
		return (_x || 0) - (_y || 0)
	}
	else if (_x instanceof Date && _y instanceof Date) {
		// eslint-disable-next-line fp/no-mutation
		_x = _x || new Date()
		// eslint-disable-next-line fp/no-mutation
		_y = _y || new Date()
		if ((_x as Date) > (_y as Date))
			return 1
		else if (_x === _y)
			return 0
		else
			return -1
	}
	else
		return _x === _y ? 0 : 1
}
export function getRanker<T>(args: { projector: Projector<T, unknown, void>, tryNumeric?: boolean/*=false*/, reverse?: boolean/*=false*/ }): Ranker<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, args.projector, args.tryNumeric) * (args.reverse === true ? -1 : 1)
	}
}
export function getComparer<T>(projector: Projector<T, unknown, void>, tryNumeric = false/*, reverse = false*/): Comparer<T> {
	//console.log(`generating comparer, try numeric is ${tryNumeric}, reversed is ${reverse} `)
	return (x: T, y: T) => {
		return compare(x, y, projector, tryNumeric) === 0
	}
}

export const identity = <T>(val: T) => val


//#region Combinators
export const constant = <T>(val: T) => () => val

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function once<R, A extends any[]>(fn?: (...a: A) => R) {
	// eslint-disable-next-line fp/no-let
	let hasRun = false
	return fn
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		? function xyz(...args: A) {
			if (!hasRun) {
				// eslint-disable-next-line fp/no-mutation
				hasRun = true
				return fn(...args)
			}
			else {
				return
			}
		}
		: undefined
}

/** Transforms a function into a partially applied one.
 * The transformed function takes the same arguments as the original function
 * except for the first one, and returns a function that only takes the original functions first argument.
 */
export function partial<A, B, Rest extends unknown[]>(fun: (a: A, ...rest: Rest) => B): (...rest: Rest) => (a: A) => B {
	return (...rest: Rest) => (a: A): B => {
		return fun(a, ...rest)
	}
}

/** Transforms a function into one that expects the original arguments in reverse order */
export function flip<A, B, Ret>(f: (a: A, b: B) => Ret): (b: B, a: A) => Ret {
	return (b: B, a: A) => f(a, b)
}

/* https://github.com/caderek/arrows/blob/master/packages/composition/src/curry.ts */
/* export function curry(fn: (...x: any[]) => any, args: any[] = []) {
	if (fn.length < 2) {
		return fn
	}

	return (...newArgs: any[]) =>
		((rest) => (rest.length >= fn.length ? fn(...rest) : curry(fn, rest)))([
			...args,
			...newArgs,
		])
}*/

/* https://github.com/TylorS/typed-curry/blob/master/src/curry.ts */
/* export function curry(fn: Function) {
	switch (fn.length) {
		case 0: return fn;
		case 1: return curry1(fn as Arity1<any, any>);
		case 2: return curry2(fn as Arity2<any, any, any>);
		case 3: return curry3(fn as Arity3<any, any, any, any>);
		case 4: return curry4(fn as Arity4<any, any, any, any, any>);
		case 5: return curry5(fn as Arity5<any, any, any, any, any, any>);
		default: throw new Error(`Its highly suggested that you do not write functions with more than 5 parameters.`);
	}
}*/

/* https://github.com/kolodny/cury/blob/master/index.ts */
function curry<A, R>(fn: (a: A) => R): (a: A) => R
function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R
function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R
function curry<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R): (a: A) => (b: B) => (c: C) => (d: D) => R
function curry(fn: (...args: any[]) => unknown) {
	return function curried(...args: any[]) {
		if (args.length >= fn.length) {
			const x = fn(...args)
			return x
		}
		return curry(fn.bind(null, ...args))
	}
}


//#endregion