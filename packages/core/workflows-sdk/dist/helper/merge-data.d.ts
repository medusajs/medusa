import { PipelineHandler } from "./pipe";
/**
 * Pipe utils that merges data from an object into a new object.
 * The new object will have a target key with the merged data from the keys if specified.
 * @param keys
 * @param target
 */
export declare function mergeData<T extends Record<string, unknown> = Record<string, unknown>, TKeys extends keyof T = keyof T, Target extends "payload" | string = string>(keys?: TKeys[], target?: Target): PipelineHandler;
