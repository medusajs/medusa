/**
 * In most casees, JSON.parse(JSON.stringify(obj)) is enough to deep copy an object.
 * But in some cases, it's not enough. For example, if the object contains a function or a proxy, it will be lost after JSON.parse(JSON.stringify(obj)).
 *
 * @param obj
 */
export declare function deepCopy<T extends Record<any, any> = Record<any, any>>(obj: T | T[]): T | T[];
