import { Tuple, ProjectorIndexed, ReducerIndexed, Predicate } from "./core";
import { stdSet } from "./set";
/** Eager, un-ordered, material, indexed associative collection */
export declare class stdObject<T extends Record<string, unknown>> implements Iterable<Tuple<keyof T, T[keyof T]>> {
    private readonly obj;
    constructor(obj: T);
    static fromKeyValues<K extends string, V>(keyValues: Iterable<Tuple<K, V>>): stdObject<Record<K, V>>;
    static fromArray<X>(arr: X[]): stdObject<Record<string, X>>;
    [Symbol.iterator](): IterableIterator<Tuple<keyof T, T[keyof T]>>;
    asObject(): Readonly<T>;
    get size(): number;
    /** TODO: Memoize this method? */
    keys(): (keyof T)[];
    /** TODO: Memoize this method? */
    values(): T[keyof T][];
    /** Check whether this dictionary contains a specific key or value */
    has(arg: {
        key: keyof T;
    } | {
        value: T[keyof T];
    }): boolean;
    /** TODO: Memoize this method? */
    entries(): Tuple<keyof T, T[keyof T]>[];
    pick<K extends keyof T>(keys: K[]): stdObject<Pick<T, K>>;
    omit<K extends keyof T>(keys: K[]): stdObject<Pick<T, Exclude<keyof T, K>>>;
    map<Y>(projector: ProjectorIndexed<T[keyof T], Y, keyof T>): stdObject<Record<string, Y>>;
    reduce<Y>(initial: Y, reducer: ReducerIndexed<T[keyof T], Y, keyof T>): Y;
    get(selector: keyof T): Readonly<T>[keyof T];
    getAll(selector: Iterable<keyof T>): stdSet<Readonly<T>[keyof T]>;
    /** Get the indexes where a value occurs or a certain predicate/condition is met */
    indexesOf(args: ({
        value: T[keyof T];
    } | {
        predicate: Predicate<T[keyof T]>;
    })): (keyof T)[];
}
