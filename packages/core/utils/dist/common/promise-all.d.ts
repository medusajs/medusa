/**
 * Promise.allSettled with error handling, safe alternative to Promise.all
 * @param promises
 * @param aggregateErrors
 */
export declare function promiseAll<T extends readonly unknown[] | []>(promises: T, { aggregateErrors }?: {
    aggregateErrors: boolean;
}): Promise<{
    -readonly [P in keyof T]: Awaited<T[P]>;
}>;
